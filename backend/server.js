const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'tasks.db');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']
}));
app.use(express.json());

// Initialize database
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// Helper to get now as ISO string
const nowISO = () => new Date().toISOString();

// Routes

// GET /api/tasks - Return all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
  res.json(tasks);
});

// GET /api/tasks/:id - Return single task
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks - Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority } = req.body;

  // Validate title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be non-empty' });
  }

  const status = 'todo';
  const created_at = nowISO();
  const updated_at = created_at;

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    title.trim(),
    description?.trim() || '',
    status,
    priority || 'medium',
    created_at,
    updated_at
  );

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Update task (partial)
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  // Check task exists
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Build dynamic update
  const fields = [];
  const values = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title must be non-empty' });
    }
    fields.push('title = ?');
    values.push(title.trim());
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description.trim());
  }
  if (status !== undefined) {
    if (!['todo', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    fields.push('status = ?');
    values.push(status);
  }
  if (priority !== undefined) {
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }
    fields.push('priority = ?');
    values.push(priority);
  }

  if (fields.length === 0) {
    // No fields to update, just return existing
    return res.json(existing);
  }

  fields.push('updated_at = ?');
  values.push(nowISO());
  values.push(id);

  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(sql).run(...values);

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
