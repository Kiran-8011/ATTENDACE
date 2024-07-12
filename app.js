const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const config = require('./config');

const app = express();

// MongoDB connection with error handling
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'secret', // consider using a more secure secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if serving over HTTPS
}));

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subject');
const attendanceRoutes = require('./routes/attendance');

app.use('/auth', authRoutes);
app.use('/subject', subjectRoutes);
app.use('/attendance', attendanceRoutes);

// Redirect root to login
app.get('/', (req, res) => res.redirect('/auth/login'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
