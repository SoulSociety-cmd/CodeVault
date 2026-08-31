import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom'
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
import './App.css'

function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/s/:slug" element={<PublicSnippet />} /><Route element={<ProtectedRoute />}><Route element={<AppShell />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/snippets" element={<MySnippets />} /><Route path="/favorites" element={<Favorites />} /><Route path="/collections" element={<Collections />} /><Route path="/search" element={<SearchResults />} /><Route path="/snippets/new" element={<SnippetForm />} /><Route path="/snippets/:id" element={<SnippetDetails />} /><Route path="/snippets/:id/edit" element={<SnippetForm editing />} /><Route path="/snippets/:id/versions" element={<VersionHistory />} /></Route></Route><Route path="*" element={<Login />} /></Routes></BrowserRouter>
}

function AppShell() { return <><header className="topbar"><Link className="brand" to="/snippets">CodeVault</Link><SearchBar /><nav><Link to="/snippets">My snippets</Link><Link to="/favorites">Favorites</Link><Link to="/collections">Collections</Link><Link to="/dashboard">Dashboard</Link></nav></header><Outlet /></> }

export default App
