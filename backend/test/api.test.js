import assert from 'node:assert/strict'
import { before, after, beforeEach, describe, it } from 'node:test'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret'
process.env.FRONTEND_URL = 'http://localhost:5173'

const { app } = await import('../src/server.js')
const User = (await import('../src/models/User.js')).default
const Snippet = (await import('../src/models/Snippet.js')).default
const Collection = (await import('../src/models/Collection.js')).default

let mongoServer
let server
let baseUrl

function cookieFrom(response) {
  const cookies = response.headers.getSetCookie?.() || []
  return cookies.map((value) => value.split(';', 1)[0]).join('; ')
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) },
  })
  const body = await response.json()
  return { response, body, cookie: cookieFrom(response) }
}

async function register(username, email) {
  const result = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password: 'password123', confirmPassword: 'password123' }),
  })
  assert.equal(result.response.status, 201)
  return result.cookie
}

function snippetBody(overrides = {}) {
  return {
    title: 'Useful JavaScript snippet',
    description: 'Searchable helper',
    code: 'const answer = 42',
    language: 'javascript',
    tags: ['utility'],
    visibility: 'private',
    ...overrides,
  }
}

before(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
  server = app.listen(0)
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await Promise.all([User.deleteMany({}), Snippet.deleteMany({}), Collection.deleteMany({})])
})

describe('CodeVault API', () => {
  it('registers, authenticates, and returns the current user', async () => {
    const cookie = await register('alice', 'alice@example.com')
    const me = await request('/api/auth/me', { headers: { cookie } })
    assert.equal(me.response.status, 200)
    assert.equal(me.body.data.user.username, 'alice')

    const login = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
    })
    assert.equal(login.response.status, 200)
    assert.match(login.cookie, /token=/)

    const originalFetch = globalThis.fetch
    const originalApiKey = process.env.OPENAI_API_KEY
    process.env.OPENAI_API_KEY = 'test-api-key'
    globalThis.fetch = async (url, options) => {
      if (!String(url).startsWith('https://api.openai.com/')) return originalFetch(url, options)
      assert.equal(options.headers.Authorization, 'Bearer test-api-key')
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ tags: ['utility', 'arrays', 'arrays', 'JavaScript'] }) } }],
      }), { status: 200, headers: { 'content-type': 'application/json' } })
    }

    try {
      const suggestions = await request('/api/snippets/suggest-tags', {
        method: 'POST',
        headers: { cookie },
        body: JSON.stringify({ title: 'Array helper', description: 'Filters values', code: 'const values = []', language: 'javascript', tags: ['utility'] }),
      })
      assert.equal(suggestions.response.status, 200)
      assert.deepEqual(suggestions.body.data.tags, ['arrays', 'javascript'])

      delete process.env.OPENAI_API_KEY
      const unavailable = await request('/api/snippets/suggest-tags', {
        method: 'POST',
        headers: { cookie },
        body: JSON.stringify({ code: 'const answer = 42', language: 'javascript' }),
      })
      assert.equal(unavailable.response.status, 503)
      assert.match(unavailable.body.message, /not configured/)
    } finally {
      globalThis.fetch = originalFetch
      if (originalApiKey === undefined) delete process.env.OPENAI_API_KEY
      else process.env.OPENAI_API_KEY = originalApiKey
    }
  })

  it('rejects unauthenticated protected requests', async () => {
    const result = await request('/api/auth/me')
    assert.equal(result.response.status, 401)
    assert.equal(result.body.success, false)
  })

  it('creates and updates a snippet with version history', async () => {
    const cookie = await register('alice', 'alice@example.com')
    const created = await request('/api/snippets', {
      method: 'POST', headers: { cookie }, body: JSON.stringify(snippetBody()),
    })
    assert.equal(created.response.status, 201)
    const id = created.body.data.snippet._id

    const updated = await request(`/api/snippets/${id}`, {
      method: 'PUT', headers: { cookie }, body: JSON.stringify(snippetBody({ title: 'Updated snippet', code: 'const answer = 43' })),
    })
    assert.equal(updated.response.status, 200)
    assert.equal(updated.body.data.snippet.title, 'Updated snippet')

    const versions = await request(`/api/snippets/${id}/versions`, { headers: { cookie } })
    assert.equal(versions.response.status, 200)
    assert.equal(versions.body.data.versions.length, 2)
  })

  it('soft-deletes a snippet', async () => {
    const cookie = await register('alice', 'alice@example.com')
    const created = await request('/api/snippets', {
      method: 'POST', headers: { cookie }, body: JSON.stringify(snippetBody()),
    })
    const id = created.body.data.snippet._id
    const deleted = await request(`/api/snippets/${id}`, { method: 'DELETE', headers: { cookie } })
    assert.equal(deleted.response.status, 200)
    const fetched = await request(`/api/snippets/${id}`, { headers: { cookie } })
    assert.equal(fetched.response.status, 404)
  })

  it('protects snippet ownership for update, delete, and private reads', async () => {
    const ownerCookie = await register('alice', 'alice@example.com')
    const otherCookie = await register('bob', 'bob@example.com')
    const created = await request('/api/snippets', {
      method: 'POST', headers: { cookie: ownerCookie }, body: JSON.stringify(snippetBody()),
    })
    const id = created.body.data.snippet._id
    const update = await request(`/api/snippets/${id}`, {
      method: 'PUT', headers: { cookie: otherCookie }, body: JSON.stringify(snippetBody()),
    })
    const remove = await request(`/api/snippets/${id}`, { method: 'DELETE', headers: { cookie: otherCookie } })
    const read = await request(`/api/snippets/${id}`, { headers: { cookie: otherCookie } })
    assert.equal(update.response.status, 403)
    assert.equal(remove.response.status, 403)
    assert.equal(read.response.status, 404)
  })

  it('supports public sharing while hiding private snippets', async () => {
    const cookie = await register('alice', 'alice@example.com')
    const privateSnippet = await request('/api/snippets', {
      method: 'POST', headers: { cookie }, body: JSON.stringify(snippetBody()),
    })
    const privatePublicRead = await request(`/api/public/snippets/${privateSnippet.body.data.snippet.slug}`)
    assert.equal(privatePublicRead.response.status, 404)

    const publicSnippet = await request('/api/snippets', {
      method: 'POST', headers: { cookie }, body: JSON.stringify(snippetBody({ title: 'Shared snippet', visibility: 'public' })),
    })
    const publicRead = await request(`/api/public/snippets/${publicSnippet.body.data.snippet.slug}`)
    assert.equal(publicRead.response.status, 200)
    assert.equal(publicRead.body.data.snippet.title, 'Shared snippet')
  })

  it('favorites and searches snippets', async () => {
    const cookie = await register('alice', 'alice@example.com')
    const created = await request('/api/snippets', {
      method: 'POST', headers: { cookie }, body: JSON.stringify(snippetBody()),
    })
    const id = created.body.data.snippet._id
    const favorite = await request(`/api/snippets/${id}/favorite`, { method: 'POST', headers: { cookie } })
    assert.equal(favorite.response.status, 200)
    assert.equal(favorite.body.data.snippet.favorites, 1)
    const search = await request('/api/snippets/search?q=searchable&favorite=true', { headers: { cookie } })
    assert.equal(search.response.status, 200)
    assert.equal(search.body.data.count, 1)
    const unfavorite = await request(`/api/snippets/${id}/favorite`, { method: 'DELETE', headers: { cookie } })
    assert.equal(unfavorite.response.status, 200)
  })

  it('creates collections and enforces collection ownership', async () => {
    const ownerCookie = await register('alice', 'alice@example.com')
    const otherCookie = await register('bob', 'bob@example.com')
    const collection = await request('/api/collections', {
      method: 'POST', headers: { cookie: ownerCookie }, body: JSON.stringify({ name: 'Utilities' }),
    })
    assert.equal(collection.response.status, 201)
    const denied = await request(`/api/collections/${collection.body.data.collection._id}`, { headers: { cookie: otherCookie } })
    assert.equal(denied.response.status, 403)
  })
})
