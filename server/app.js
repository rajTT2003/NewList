// app.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Import route handlers
const authLocalRoutes = require('./routes/authLocal');
const authGoogleRoutes = require('./routes/authGoogle');
const odooRoutes = require('./routes/odooRoutes');
const cartRoutes = require('./routes/cart'); // ✅ import your cart routes

require('./config/passport'); // Initialize passport config

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Enable CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Built-in middlewares
app.use(express.json()); // To parse JSON bodies

// ✅ Session middleware (needed for Passport)
app.use(session({
  secret: process.env.SECRET_KEY || 'default-secret',
  resave: false,
  saveUninitialized: false,
}));

// ✅ Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use(authLocalRoutes);
app.use(authGoogleRoutes);
app.use(odooRoutes);
app.use('/api/cart', cartRoutes); // ✅ prefix it with /api/cart


// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ NewList server is running!');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
