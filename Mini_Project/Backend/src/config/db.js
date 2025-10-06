const mongoose = require('mongoose');


/**
* Connects to MongoDB using MONGO_URI from environment variables.
* Returns a Promise that resolves when connected or rejects on error.
*/
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI not defined in environment');


    // Use new URL parser and unified topology for modern connection
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


    console.log('MongoDB connected successfully!');
};


module.exports = connectDB;