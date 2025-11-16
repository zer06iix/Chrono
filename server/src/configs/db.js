const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const database = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'chrono'
        });
        console.log(`MongoDB connected: ${database.connection.host}`);
        console.log(`Database: ${database.connection.name}`);
    } catch (error) {
        console.log(`Error connecting to database: ${error}`);
        process.exit(1);
    }

};


module.exports = connectDB;