const Notification = require('../models/Notification');

function initSocket(io) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    const userRole = socket.handshake.auth?.userRole;

    if (userId && userRole) {
      socket.join(`${userRole}_${userId}`);
    }

    // Chat messages
    socket.on('send_message', (data) => {
      const { conversationId, recipientId, content } = data;
      if (recipientId) {
        io.to(`user_${recipientId}`).to(`driver_${recipientId}`).emit('new_message', {
          conversationId,
          message: { sender: userId, senderRole: userRole, content, createdAt: new Date() },
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, recipientId } = data;
      if (recipientId) {
        io.to(`user_${recipientId}`).to(`driver_${recipientId}`).emit('typing', {
          conversationId,
          userId,
        });
      }
    });

    // Driver location update
    socket.on('location_update', (data) => {
      const { rideId, lat, lng } = data;
      if (rideId) {
        io.to(`ride_${rideId}`).emit('driver_location', { rideId, lat, lng });
      }
    });

    // Join ride room for live tracking
    socket.on('join_ride', (rideId) => {
      socket.join(`ride_${rideId}`);
    });

    socket.on('disconnect', () => {
      // cleanup
    });
  });
}

// Helper to create and emit notification
async function createNotification(io, { recipient, recipientRole, type, title, body, relatedId }) {
  try {
    const notification = await Notification.create({ recipient, recipientRole, type, title, body, relatedId });
    if (io) {
      io.to(`${recipientRole}_${recipient}`).emit('notification', notification);
    }
    return notification;
  } catch {
    return null;
  }
}

module.exports = { initSocket, createNotification };
