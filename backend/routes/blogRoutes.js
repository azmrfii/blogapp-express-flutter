const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', auth, upload.single('image'), createBlog); 
router.put('/:id', auth, upload.single('image'), updateBlog);
router.delete('/:id', auth, deleteBlog);

module.exports = router;
