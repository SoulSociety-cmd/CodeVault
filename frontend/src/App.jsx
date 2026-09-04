import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom'
import { LayoutDashboard, Library, Heart, FolderKanban, LogOut, Moon, Sun, Menu, X } from 'lucide-react'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SearchBar from './components/SearchBar.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MySnippets from './pages/MySnippets.jsx'
import SnippetDetails from './pages/SnippetDetails.jsx'
import SnippetForm from './pages/SnippetForm.jsx'
import SearchResults from './pages/SearchResults.jsx'
import Favorites from './pages/Favorites.jsx'
import Collections from './pages/Collections.jsx'
import PublicSnippet from './pages/PublicSnippet.jsx'
import VersionHistory from './pages/VersionHistory.jsx'
import Landing from './pages/Landing.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('codevault-theme') || 'dark')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('codevault-theme', theme) }, [theme])
  return <BrowserRouter><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/s/:slug" element={<PublicSnippet />} /><Route element={<ProtectedRoute />}><Route element={<AppShell theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/snippets" element={<MySnippets />} /><Route path="/favorites" element={<Favorites />} /><Route path="/collections" element={<Collections />} /><Route path="/search" element={<SearchResults />} /><Route path="/snippets/new" element={<SnippetForm />} /><Route path="/snippets/:id" element={<SnippetDetails />} /><Route path="/snippets/:id/edit" element={<SnippetForm editing />} /><Route path="/snippets/:id/versions" element={<VersionHistory />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>
}

function AppShell({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const links = [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { to: '/snippets', label: 'My snippets', icon: Library }, { to: '/favorites', label: 'Favorites', icon: Heart }, { to: '/collections', label: 'Collections', icon: FolderKanban }]
  return <div className="app-shell"><button className="mobile-menu-button" type="button" onClick={() => setOpen((current) => !current)} aria-label="Toggle navigation">{open ? <X size={20} /> : <Menu size={20} />}</button><aside className={`app-sidebar ${open ? 'is-open' : ''}`}><Link className="brand" to="/snippets" onClick={() => setOpen(false)}>CodeVault</Link><nav>{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)}><Icon size={17} />{label}</Link>)}</nav><div className="sidebar-bottom"><button type="button" onClick={onToggleTheme}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}{theme === 'dark' ? 'Light mode' : 'Dark mode'}</button><button type="button" onClick={logout}><LogOut size={17} /> Sign out</button></div></aside><header className="topbar"><SearchBar /></header><div className="app-content"><Outlet /></div></div>
}

export default App
