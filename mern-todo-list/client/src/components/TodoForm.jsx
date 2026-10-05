import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAdding(true);
    const ok = await onAdd({ title: title.trim(), description: description.trim() });
    setAdding(false);
    if (ok) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="todo-form" onSubmit={submit}>
      <input
        type="text"
        placeholder="What needs doing?"
        value={title}
        maxLength={120}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
        required
      />
      <input
        type="text"
        placeholder="Add a note (optional)"
        value={description}
        maxLength={500}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Task note"
      />
      <button className="btn" type="submit" disabled={adding || !title.trim()}>
        {adding ? 'Adding…' : 'Add task'}
      </button>
    </form>
  );
}
