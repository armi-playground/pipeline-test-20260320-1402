import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask } from '../api'
import type { CreateTaskRequest } from '../types/task'

function CreateTaskPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    priority: 'medium',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSubmitting(true)
    try {
      const task = await createTask(form)
      navigate(`/tasks/${task.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>

      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="What needs to be done?"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add more details..."
            rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Priority</label>
          <select
            value={form.priority}
            onChange={e => setForm(prev => ({ ...prev, priority: e.target.value as CreateTaskRequest['priority'] }))}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.625rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            fontSize: '1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
            alignSelf: 'flex-start',
          }}
        >
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default CreateTaskPage
