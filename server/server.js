require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const authRoutes         = require('./routes/auth');
const rideRoutes         = require('./routes/rides');
const driverRoutes       = require('./routes/drivers');
const adminRoutes        = require('./routes/admin');
const uploadRoutes       = require('./routes/uploads');
const searchRoutes       = require('./routes/search');
const messageRoutes      = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes       = require('./routes/reviews');
const supportRoutes      = require('./routes/support');

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.set('io', io);
initSocket(io);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',          authRoutes);
app.use('/api/rides',         rideRoutes);
app.use('/api/drivers',       driverRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/uploads',       uploadRoutes);
app.use('/api/search',        searchRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews',       reviewRoutes);
app.use('/api/support',       supportRoutes);

app.get('/', (req, res) => res.json({ message: 'FosaRide API is running' }));

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
