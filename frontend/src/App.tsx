import { Routes, Route, Link } from 'react-router-dom'
import TaskListPage from './pages/TaskListPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Task Tracker</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: '#94a3b8' }}>Tasks</Link>
          <Link to="/new" style={{ color: '#94a3b8' }}>New Task</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>
        <Routes>
          <Route path="/" element={<TaskListPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/new" element={<CreateTaskPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
