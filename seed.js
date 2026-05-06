const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();

        const instructor = await User.create({
            name: 'Dr. Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            role: 'instructor'
        });

        await Course.create([
            {
                title: 'Mastering React and the MERN Stack',
                description: 'A comprehensive guide to building full-stack applications.',
                instructor: instructor._id,
                category: 'Development',
                price: 99,
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
                lessons: [{ title: 'Introduction', content: 'Welcome to the course!' }]
            },
            {
                title: 'Advanced UI Design with CSS',
                description: 'Learn how to create stunning premium interfaces.',
                instructor: instructor._id,
                category: 'Design',
                price: 79,
                thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&auto=format&fit=crop',
                lessons: [{ title: 'Color Theory', content: 'Deep dive into palettes.' }]
            }
        ]);

        console.log('Data Seeded!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
