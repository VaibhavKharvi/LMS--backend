const express = require('express');
const { enrollInCourse, getMyCourses, getInstructorStudents } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, enrollInCourse);
router.get('/my-courses', protect, getMyCourses);
router.get('/instructor-students', protect, authorize('instructor'), getInstructorStudents);

module.exports = router;
