const express = require('express');
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    approveCourse,
} = require('../controllers/courseController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(optionalProtect, getCourses).post(protect, authorize('instructor', 'admin'), createCourse);

router
    .route('/:id')
    .get(getCourseById)
    .put(protect, authorize('instructor', 'admin'), updateCourse)
    .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.put('/:id/approve', protect, authorize('admin'), approveCourse);

module.exports = router;
