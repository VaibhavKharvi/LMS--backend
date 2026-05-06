const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        progress: {
            type: Number,
            required: true,
            default: 0,
        },
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
