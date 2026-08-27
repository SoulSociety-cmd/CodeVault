import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MySnippets from './pages/MySnippets.jsx'
import SnippetDetails from './pages/SnippetDetails.jsx'
import SnippetForm from './pages/SnippetForm.jsx'
import './App.css'

function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/snippets" element={<MySnippets />} /><Route path="/snippets/new" element={<SnippetForm />} /><Route path="/snippets/:id" element={<SnippetDetails />} /><Route path="/snippets/:id/edit" element={<SnippetForm editing />} /></Route><Route path="*" element={<Login />} /></Routes></BrowserRouter>
}

function Dashboard() { const { currentUser, logout } = useAuth(); return <main className="dashboard"><p className="eyebrow">CODEVAULT / DASHBOARD</p><h1>Welcome, {currentUser.username}.</h1><p>Your private vault is ready.</p><button onClick={logout}>Sign out</button><Link to="/login">Back to sign in</Link></main> }

export default App
