// Mongoose library ko import kar rahe hain - ye MongoDB ke saath connection banane ke liye use hota hai
import mongoose from 'mongoose';

// Database connection function - ye function MongoDB se connection establish karta hai
const connectDb = async () => {
    try {
        // MongoDB se connection banane ki koshish kar rahe hain
        // process.env.MONGO_URI environment variable se database URL mil raha hai
        await mongoose.connect(process.env.MONGO_URI);
        
        // Agar connection successful hai to ye message print hoga
        console.log('✅ MongoDb connected successfully');
    } catch (err) {
        // Agar connection fail ho jaye to error message print hoga
        console.log('❌ MongoDb connection failed', err.message);
        
        // Application ko band kar denge agar database connect nahi hua
        process.exit(1);
    }
};

// Is function ko export kar rahe hain taaki dusre files mein use kar saken
export default connectDb;