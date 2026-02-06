require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes    = require('./routes/auth');
const rideRoutes    = require('./routes/rides');
const driverRoutes  = require('./routes/drivers');
const adminRoutes   = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/rides',   rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin',   adminRoutes);

app.get('/', (req, res) => res.json({ message: 'FosaRide API is running' }));

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
