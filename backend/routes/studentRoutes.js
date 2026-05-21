const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getAnalytics,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes below are protected (require login)

// GET  /api/students/analytics
router.get('/analytics', protect, getAnalytics);

// GET  /api/students
// POST /api/students
router
  .route('/')
  .get(protect, getStudents)
  .post(protect, upload.single('profilePicture'), createStudent);

// GET    /api/students/:id
// PUT    /api/students/:id
// DELETE /api/students/:id
router
  .route('/:id')
  .get(protect, getStudent)
  .put(protect, upload.single('profilePicture'), updateStudent)
  .delete(protect, deleteStudent);

module.exports = router;