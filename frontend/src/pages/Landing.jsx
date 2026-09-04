import { ArrowRight, Code2, GitBranch, Search, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon: Code2, title: 'Keep code close', text: 'Save reusable snippets with syntax-aware editing and version history.' },
  { icon: Search, title: 'Find it fast', text: 'Search titles, tags, languages, descriptions, and code from one place.' },
  { icon: Share2, title: 'Share deliberately', text: 'Publish selected snippets with a clean, shareable public URL.' },
]

export default function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="brand" to="/">CodeVault</Link>
        <div className="landing-nav-actions"><Link to="/login">Sign in</Link><Link className="primary-button" to="/register">Get started <ArrowRight size={16} /></Link></div>
      </nav>
      <section className="landing-hero">
        <div className="landing-hero-copy"><p className="eyebrow">A QUIET HOME FOR USEFUL CODE</p><h1>Your Code.<br /><span>Organized.</span></h1><p className="landing-lede">Save, organize, search, and share your most useful code snippets in one place.</p><div className="landing-actions"><Link className="primary-button" to="/register">Get started <ArrowRight size={16} /></Link><Link className="secondary-button" to="/search">Explore public snippets</Link></div></div>
        <div className="landing-terminal"><div className="terminal-bar"><span /><span /><span /><small>codevault / snippets</small></div><pre><code>{`const vault = {
  focus: "building",
  snippets: "organized",
  context: "always nearby"
}`}</code></pre><div className="terminal-status"><GitBranch size={14} /> ready to build</div></div>
      </section>
      <section className="landing-features"><p className="eyebrow">BUILT FOR THE DAILY LOOP</p><h2>Less hunting. More making.</h2><div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="landing-cta"><div><p className="eyebrow">START SMALL</p><h2>Give your best code a proper home.</h2></div><Link className="primary-button" to="/register">Create your vault <ArrowRight size={16} /></Link></section>
      <footer className="landing-footer"><span>CodeVault</span><span>Made for thoughtful developers.</span></footer>
    </main>
  )
}
