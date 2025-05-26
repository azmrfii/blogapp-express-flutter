const pool = require('../db');

// GET all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT blogs.*, users.name AS author_name
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      ORDER BY blogs.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET blog detail
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT blogs.*, users.name AS author_name
      FROM blogs
      JOIN users ON blogs.author_id = users.id
      WHERE blogs.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create blog
exports.createBlog = async (req, res) => {
  const { title, description } = req.body;
  const author_id = req.user.id;

  try {
    const result = await pool.query(`
      INSERT INTO blogs (title, description, author_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [title, description, author_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update blog
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blog.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });

    if (blog.rows[0].author_id !== userId) {
      return res.status(403).json({ message: 'You are not the author of this blog' });
    }

    const updated = await pool.query(`
      UPDATE blogs
      SET title = $1, description = $2
      WHERE id = $3
      RETURNING *
    `, [title, description, id]);

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (blog.rows.length === 0) return res.status(404).json({ message: 'Blog not found' });

    if (blog.rows[0].author_id !== userId) {
      return res.status(403).json({ message: 'You are not the author of this blog' });
    }

    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};