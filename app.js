// app.js
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const adminRoutes    = require('./routes/adminRoutes');
const marketerRoutes = require('./routes/marketerRoutes');
const activityListRoutes = require('./routes/activityListRoutes');
const mailRoutes = require('./routes/mailRoutes')
const templateRoutes = require('./routes/templateRoutes')

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:      process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/admin',    adminRoutes);
app.use('/marketer', marketerRoutes);
app.use('/activity', activityListRoutes);
app.use('/mail',mailRoutes)
app.use('/template', templateRoutes)

// ─── DB + SERVER START ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)  // no need for useNewUrlParser/useUnifiedTopology
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
