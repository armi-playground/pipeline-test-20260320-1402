# Backend - Task Tracker API

## Setup

```bash
cd backend
npm install
npm start
```

The server will start on `http://localhost:3001`.

## Database

SQLite database is automatically created at `backend/tasks.db` on first run.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | Return all tasks |
| GET | /api/tasks/:id | Return a single task (404 if not found) |
| POST | /api/tasks | Create a new task |
| PATCH | /api/tasks/:id | Update a task (partial) |
| DELETE | /api/tasks/:id | Delete a task (204 on success, 404 if not found) |

## Task Schema

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

## API Examples

### Create a task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My task", "description": "Details", "priority": "high"}'
```

### List all tasks
```bash
curl http://localhost:3001/api/tasks
```

### Get a single task
```bash
curl http://localhost:3001/api/tasks/1
```

### Update a task
```bash
curl -X PATCH http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```

## Error Responses

All errors return JSON with an `error` field:
```json
{"error": "Task not found"}
```
