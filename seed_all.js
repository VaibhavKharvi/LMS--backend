const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedAll = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();
        await Enrollment.deleteMany();

        // 1. Create Admin
        await User.create({
            name: 'System Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // 2. Create Instructor
        const instructor = await User.create({
            name: 'Master Instructor',
            email: 'instructor@example.com',
            password: 'password123',
            role: 'instructor'
        });

        // 3. Create Student
        await User.create({
            name: 'Learning Student',
            email: 'student@example.com',
            password: 'password123',
            role: 'student'
        });

        // 4. Create a Sample Course for the Instructor
        await Course.create({
            title: 'MERN Stack Architecture',
            description: 'Learn how to build scalable LMS systems.',
            instructor: instructor._id,
            category: 'Development',
            price: 4999,
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            lessons: [{ title: 'Getting Started', content: 'Intro to MERN' }]
        });

        console.log('Database Seeded with Admin, Instructor, and Student accounts!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAll();
