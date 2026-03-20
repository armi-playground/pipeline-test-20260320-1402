import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Task } from '../types/task'
import { fetchTasks, deleteTask } from '../api'
import TaskCard from '../components/TaskCard'

function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all')

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) return <p>Loading tasks...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Tasks ({filtered.length})</h2>
        <Link to="/new" style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
        }}>+ New Task</Link>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['all', 'todo', 'in_progress', 'done'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: filter === s ? '#2563eb' : 'white',
              color: filter === s ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '0.8125rem',
            }}
          >
            {s === 'all' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No tasks found. Create one to get started!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskListPage
