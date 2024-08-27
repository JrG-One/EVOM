// server.js or index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const companyRoutes = require('./companyRoutes');
const app = express();
app.use(cors());
app.options('*', cors())
app.use(bodyParser.json()); 
app.use('/api', authRoutes, companyRoutes); 

// Connect to MongoDB Atlas
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
