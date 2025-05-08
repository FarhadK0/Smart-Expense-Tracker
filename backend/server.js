const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/expenses', require('./src/routes/expense'));
app.use('/api/admin', require('./src/routes/adminauth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/budget', require('./src/routes/budget'));
app.use('/api/insight', require('./src/routes/insight'));
app.use('/api/report', require('./src/routes/report'));
app.use('/api/notification', require('./src/routes/notification'));
app.use('/api/user', require('./src/routes/user'));




// Default route
app.get('/', (req, res) => {
    res.send('Smart Expense Tracker API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close the server and exit the process
    server.close(() => process.exit(1));
});
