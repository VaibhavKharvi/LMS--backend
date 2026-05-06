const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
});

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        thumbnail: {
            type: String,
            default: 'https://via.placeholder.com/150',
        },
        lessons: [lessonSchema],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
