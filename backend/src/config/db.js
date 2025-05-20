//Import the mongoose library to work with MogoDB in Node,js
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    //Try to connect to MongoDB using the connection string stored in the environment variable MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new unified topology engine
    });

    // Log a success message to the console if the connection is successful
    console.log(`MongoDB connected: ${conn.connection.host}`);
  }
  catch (error) {
    // If there is an error during the connection, log the error message to the console
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with a failure code
  }
};


// Export the connectDB function so it can be used in other parts of the files
module.exports = connectDB;