import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import TodoForm from '../components/TodoForm.jsx';
import TodoItem from '../components/TodoItem.jsx';
import { fetchTodos, createTodo, updateTodo, deleteTodo, errorMessage } from '../services/api.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTodos()
      .then((res) => setTodos(res.data))
      .catch((err) => setError(errorMessage(err, 'Unable to load your tasks.')))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (data) => {
    setError('');
    try {
      const res = await createTodo(data);
      setTodos((prev) => [res.data, ...prev]);
      return true;
    } catch (err) {
      setError(errorMessage(err, 'Unable to create task.'));
      return false;
    }
  };

  const handleEdit = async (id, data) => {
    setError('');
    try {
      const res = await updateTodo(id, data);
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      return true;
    } catch (err) {
      setError(errorMessage(err, 'Unable to update task.'));
      return false;
    }
  };

  const handleToggle = (todo) => handleEdit(todo._id, { completed: !todo.completed });

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(errorMessage(err, 'Unable to delete task.'));
    }
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const visible = todos.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
  );

  return (
    <section className="dashboard">
      <h1>{user.name}'s tasks</h1>
      <p className="muted">
        {todos.length === 0 ? 'Nothing here yet.' : `${remaining} left, ${todos.length - remaining} done.`}
      </p>

      <TodoForm onAdd={handleAdd} />
      {error && <p className="error" role="alert">{error}</p>}

      {todos.length > 0 && (
        <div className="filters" role="group" aria-label="Filter tasks">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`chip ${filter === f ? 'on' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="muted">Fetching your tasks…</p>
      ) : todos.length === 0 ? (
        <div className="empty">
          <strong>No tasks yet.</strong>
          <span>Add your first task above to get started.</span>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty"><span>No {filter} tasks.</span></div>
      ) : (
        <ul className="todo-list">
          {visible.map((t) => (
            <TodoItem key={t._id} todo={t} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </ul>
      )}
    </section>
  );
}
