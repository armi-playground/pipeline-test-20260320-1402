import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Task } from '../types/task'
import { fetchTask, updateTask, deleteTask } from '../api'

const STATUS_OPTIONS = ['todo', 'in_progress', 'done'] as const
const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const

function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTask(Number(id))
      .then(setTask)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (status: Task['status']) => {
    if (!task) return
    const updated = await updateTask(task.id, { status })
    setTask(updated)
  }

  const handlePriorityChange = async (priority: Task['priority']) => {
    if (!task) return
    const updated = await updateTask(task.id, { priority })
    setTask(updated)
  }

  const handleDelete = async () => {
    if (!task) return
    await deleteTask(task.id)
    navigate('/')
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>
  if (!task) return <p>Task not found</p>

  const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }[task.priority]

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2>{task.title}</h2>
        <button onClick={handleDelete} style={{
          backgroundColor: '#ef4444', color: 'white', border: 'none',
          padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer',
        }}>Delete</button>
      </div>

      <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>{task.description}</p>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Status</label>
          <select
            value={task.status}
            onChange={e => handleStatusChange(e.target.value as Task['status'])}
            style={{ padding: '0.375rem 0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Priority</label>
          <select
            value={task.priority}
            onChange={e => handlePriorityChange(e.target.value as Task['priority'])}
            style={{ padding: '0.375rem 0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            {PRIORITY_OPTIONS.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginBottom: '0.25rem' }}>Priority Level</label>
          <span style={{ color: priorityColor, fontWeight: 600 }}>{task.priority.toUpperCase()}</span>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
        <p>Created: {new Date(task.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
      </div>
    </div>
  )
}

export default TaskDetailPage
