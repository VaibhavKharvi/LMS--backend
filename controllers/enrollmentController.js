const Enrollment = require('../models/Enrollment');

// @desc    Enroll in a course
// @route   POST /api/enroll
// @access  Private/Student
const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;

    try {
        const alreadyEnrolled = await Enrollment.findOne({ 
            student: req.user._id, 
            course: courseId 
        });

        if (alreadyEnrolled) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const enrollment = await Enrollment.create({
            student: req.user._id,
            course: courseId,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enroll/my-courses
// @access  Private/Student
const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all students enrolled in instructor's courses
// @route   GET /api/enroll/instructor-students
// @access  Private/Instructor
const getInstructorStudents = async (req, res) => {
    try {
        // Find all enrollments where the course belongs to this instructor
        const enrollments = await Enrollment.find()
            .populate({
                path: 'course',
                match: { instructor: req.user._id }
            })
            .populate('student', 'name email');

        // Filter out enrollments that didn't match the instructor's courses
        const filtered = enrollments.filter(e => e.course !== null);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { enrollInCourse, getMyCourses, getInstructorStudents };
