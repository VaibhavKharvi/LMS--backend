const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        let filter = { isApproved: true };
        
        // If user is logged in, show their own courses + all approved courses
        // If admin, show everything
        if (req.user) {
            if (req.user.role === 'admin') {
                filter = {};
            } else {
                filter = {
                    $or: [
                        { isApproved: true },
                        { instructor: req.user._id }
                    ]
                };
            }
        }
        
        const courses = await Course.find(filter).populate('instructor', 'name');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name');

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
    const { title, description, category, price, thumbnail, lessons } = req.body;

    const course = new Course({
        title,
        description,
        instructor: req.user._id,
        category,
        price,
        thumbnail,
        lessons,
    });

    try {
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: 'Invalid course data' });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
    const { title, description, category, price, thumbnail, lessons } = req.body;

    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            // Check if user is the instructor of this course
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to update this course' });
            }

            course.title = title || course.title;
            course.description = description || course.description;
            course.category = category || course.category;
            course.price = price || course.price;
            course.thumbnail = thumbnail || course.thumbnail;
            course.lessons = lessons || course.lessons;

            const updatedCourse = await course.save();
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to delete this course' });
            }

            await Course.deleteOne({ _id: req.params.id });
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve a course
// @route   PUT /api/courses/:id/approve
// @access  Private/Admin
const approveCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            course.isApproved = true;
            await course.save();
            res.json({ message: 'Course approved successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    approveCourse,
};
