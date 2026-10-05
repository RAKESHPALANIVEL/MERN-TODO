const Todo = require('../models/Todo');

// Finds a todo only if it belongs to the logged-in user.
// Returns 404 (not 403) so other users' task IDs are never revealed.
const findOwned = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
  if (!todo) {
    res.status(404);
    throw new Error('Task not found');
  }
  return todo;
};

// GET /api/todos
exports.getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
};

// POST /api/todos
exports.createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Title is required');
    }
    // userId always comes from the verified JWT, never from the request body
    const todo = await Todo.create({ title, description, userId: req.user._id });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

// PUT /api/todos/:id
exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await findOwned(req, res);
    const { title, description, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/todos/:id
exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await findOwned(req, res);
    await todo.deleteOne();
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
