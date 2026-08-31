import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Eye, Heart, Code, Clock } from 'lucide-react'
import { getDashboardStats } from '../services/dashboardService.js'
import { useToast } from '../hooks/useToast.js'
import './Dashboard.css'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#a855f7']

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await getDashboardStats()
        setStats(response.data.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics')
        showToast('Failed to load dashboard statistics', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [showToast])

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-loading">
          <p>Loading dashboard...</p>
        </div>
      </main>
    )
  }

  if (error || !stats) {
    return (
      <main className="dashboard">
        <div className="dashboard-error">
          <p>{error || 'Failed to load dashboard'}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </main>
    )
  }

  const { stats: overview, languageStats, recentSnippets, mostViewedSnippets, mostFavoritedSnippets, recentActivity } = stats

  // Prepare data for charts
  const languageChartData = languageStats.map((lang) => ({
    name: lang._id,
    value: lang.count,
  }))

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <p className="eyebrow">CODEVAULT / DASHBOARD</p>
        <h1>Dashboard</h1>
        <p className="subtitle">Overview of your code snippet collection</p>
      </div>

      {/* Stats Overview */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total-snippets">
            <Code size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Snippets</p>
            <p className="stat-value">{overview.totalSnippets}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon public-snippets">
            <Eye size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Public Snippets</p>
            <p className="stat-value">{overview.public}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon private-snippets">
            <Code size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Private Snippets</p>
            <p className="stat-value">{overview.private}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon favorites">
            <Heart size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Favorites</p>
            <p className="stat-value">{overview.favorites}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={20} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Views</p>
            <p className="stat-value">{overview.views}</p>
          </div>
        </div>
      </section>

      {/* Language Distribution Chart */}
      {languageChartData.length > 0 && (
        <section className="chart-section">
          <h2>Language Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} snippet${value > 1 ? 's' : ''}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Recent Activity - Simple List */}
      {recentActivity.length > 0 && (
        <section className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((snippet) => (
              <div key={snippet._id} className="activity-item">
                <div className="activity-icon">
                  <Clock size={16} />
                </div>
                <div className="activity-content">
                  <Link to={`/snippets/${snippet._id}`} className="activity-title">
                    {snippet.title}
                  </Link>
                  <div className="activity-meta">
                    <span className="language">{snippet.language}</span>
                    <span className="timestamp">
                      {new Date(snippet.updatedAt).toLocaleDateString()} {new Date(snippet.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="activity-stats">
                  <span className="stat">👁 {snippet.views}</span>
                  <span className="stat">⭐ {snippet.favorites}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Three-column layout for Recent, Most Viewed, Most Favorited */}
      <div className="snippets-grid">
        {/* Recent Snippets */}
        {recentSnippets.length > 0 && (
          <section className="snippet-section">
            <h2>Recent Snippets</h2>
            <div className="snippet-list">
              {recentSnippets.map((snippet) => (
                <Link key={snippet._id} to={`/snippets/${snippet._id}`} className="snippet-item">
                  <div className="snippet-header">
                    <h3>{snippet.title}</h3>
                    <span className="language">{snippet.language}</span>
                  </div>
                  <div className="snippet-stats">
                    <span>👁 {snippet.views}</span>
                    <span>⭐ {snippet.favorites}</span>
                  </div>
                  <p className="snippet-date">{new Date(snippet.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Most Viewed Snippets */}
        {mostViewedSnippets.length > 0 && (
          <section className="snippet-section">
            <h2>Most Viewed</h2>
            <div className="snippet-list">
              {mostViewedSnippets.map((snippet) => (
                <Link key={snippet._id} to={`/snippets/${snippet._id}`} className="snippet-item">
                  <div className="snippet-header">
                    <h3>{snippet.title}</h3>
                    <span className="language">{snippet.language}</span>
                  </div>
                  <div className="snippet-stats">
                    <span>👁 {snippet.views}</span>
                    <span>⭐ {snippet.favorites}</span>
                  </div>
                  <p className="snippet-date">{new Date(snippet.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Most Favorited Snippets */}
        {mostFavoritedSnippets.length > 0 && (
          <section className="snippet-section">
            <h2>Most Favorited</h2>
            <div className="snippet-list">
              {mostFavoritedSnippets.map((snippet) => (
                <Link key={snippet._id} to={`/snippets/${snippet._id}`} className="snippet-item">
                  <div className="snippet-header">
                    <h3>{snippet.title}</h3>
                    <span className="language">{snippet.language}</span>
                  </div>
                  <div className="snippet-stats">
                    <span>👁 {snippet.views}</span>
                    <span>⭐ {snippet.favorites}</span>
                  </div>
                  <p className="snippet-date">{new Date(snippet.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default Dashboard
