const mongoose =require("mongoose")

 const connectDB = async () => {
  try {
    // const mongoUri = process.env.NODE_ENV === 'test' 
    //   ? process.env.MONGODB_TEST_URI 
    //   : process.env.MONGODB_URI;

    // const mongoUri =process.env.MONGODB_URI;
    const mongoUri="mongodb+srv://Sofrik-PMS:Sofrik-PMS@cluster0.kqyyb5y.mongodb.net/WhiteBoard?retryWrites=true&w=majority&appName=Cluster0"
    if (!mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports =connectDB;