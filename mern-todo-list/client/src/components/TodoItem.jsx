import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!title.trim() || title.trim() === todo.title) {
      setTitle(todo.title);
      setEditing(false);
      return;
    }
    setBusy(true);
    const ok = await onEdit(todo._id, { title: title.trim() });
    setBusy(false);
    if (ok) setEditing(false);
  };

  return (
    <li className={`todo ${todo.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
      />
      <div className="todo-body">
        {editing ? (
          <input
            type="text"
            className="edit-input"
            value={title}
            autoFocus
            maxLength={120}
            disabled={busy}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') {
                setTitle(todo.title);
                setEditing(false);
              }
            }}
          />
        ) : (
          <span className="todo-title" onDoubleClick={() => setEditing(true)}>{todo.title}</span>
        )}
        {todo.description && <span className="todo-desc">{todo.description}</span>}
      </div>
      <div className="todo-actions">
        <button className="btn btn-ghost" onClick={() => setEditing(true)}>Edit</button>
        <button className="btn btn-ghost danger" onClick={() => onDelete(todo._id)}>Delete</button>
      </div>
    </li>
  );
}
