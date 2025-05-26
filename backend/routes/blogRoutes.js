const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;