import { Link } from 'react-router-dom'
import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
  onDelete: (id: number) => void
}

const statusColors: Record<Task['status'], string> = {
  todo: '#6b7280',
  in_progress: '#2563eb',
  done: '#22c55e',
}

const priorityColors: Record<Task['priority'], string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1rem 1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    }}>
      <div style={{ flex: 1 }}>
        <Link to={`/tasks/${task.id}`} style={{ fontWeight: 500, fontSize: '1rem' }}>
          {task.title}
        </Link>
        {task.description && (
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {task.description.slice(0, 100)}{task.description.length > 100 ? '...' : ''}
          </p>
        )}
      </div>

      <span style={{
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        backgroundColor: `${statusColors[task.status]}20`,
        color: statusColors[task.status],
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}>
        {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </span>

      <span style={{
        fontSize: '0.6875rem',
        padding: '0.125rem 0.375rem',
        borderRadius: '4px',
        border: `1px solid ${priorityColors[task.priority]}`,
        color: priorityColors[task.priority],
        fontWeight: 600,
        textTransform: 'uppercase',
      }}>
        {task.priority}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        style={{
          background: 'none', border: 'none', color: '#9ca3af',
          cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem',
        }}
        title="Delete"
      >
        x
      </button>
    </div>
  )
}

export default TaskCard
