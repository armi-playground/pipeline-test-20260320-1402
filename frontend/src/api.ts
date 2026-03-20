import type { Task, CreateTaskRequest, UpdateTaskRequest } from './types/task'

const BASE_URL = '/api'

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`)
  if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`)
  return res.json()
}

export async function fetchTask(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch task: ${res.statusText}`)
  return res.json()
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to create task: ${res.statusText}`)
  return res.json()
}

export async function updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update task: ${res.statusText}`)
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete task: ${res.statusText}`)
}
