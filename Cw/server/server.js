const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 1. Declare models BEFORE loading routes
global.Helpdesk = require('./api/models/helpdeskModel');
global.User = require('./api/models/userModel'); // Add User Model
global.Message = require('./api/models/messageModel'); // Add Message Model

const helpdeskRoutes = require('./api/routes/helpdeskRoutes');
const authRoutes = require('./api/routes/authRoutes'); // Add auth routes
const messageRoutes = require('./api/routes/messageRoutes'); // Add message routes

const uri = "mongodb://127.0.0.1:27017/HelpdeskDB";

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Local successfully!'))
  .catch(err => console.error('Database connection error:', err));

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 2. Register routes with app
helpdeskRoutes(app);
authRoutes(app); // Register auth routes
messageRoutes(app); // Register message routes

app.listen(port, () => {
  console.log(`Helpdesk RESTful API server is running on port: ${port}`);
});