const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const clearData = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();
        await Enrollment.deleteMany();
        console.log('Database Cleared! You can now start with fresh real-time data.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearData();
