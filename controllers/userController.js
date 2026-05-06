const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get dashboard stats based on role
// @route   GET /api/user/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const enrollments = await Enrollment.find({ student: req.user._id });
            const enrolledCount = enrollments.length;
            let completedLessonsCount = 0;
            enrollments.forEach(enrol => {
                completedLessonsCount += enrol.completedLessons.length;
            });
            const learningHours = (completedLessonsCount * 1.5).toFixed(1);
            return res.json({ enrolledCount, completedLessonsCount, learningHours });
        }

        if (req.user.role === 'instructor') {
            const courses = await Course.find({ instructor: req.user._id });
            const courseIds = courses.map(c => c._id);
            const enrollments = await Enrollment.find({ course: { $in: courseIds } });
            
            const totalStudents = enrollments.length;
            const totalCourses = courses.length;
            const totalEarnings = courses.reduce((acc, curr) => acc + (curr.price * totalStudents), 0);

            return res.json({ totalStudents, totalCourses, totalEarnings });
        }

        if (req.user.role === 'admin') {
            const totalUsers = await User.countDocuments();
            const totalCourses = await Course.countDocuments();
            const totalEnrollments = await Enrollment.countDocuments();
            
            return res.json({ totalUsers, totalCourses, totalEnrollments });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/user/all
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser };
