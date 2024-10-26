const mongoose = require('mongoose');

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully' + '\n');
    } catch(err){
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectToDB;

