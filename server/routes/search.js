const express = require('express');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Search rides
router.get('/rides', auth, async (req, res) => {
  try {
    const { transportType, destination, source, date, status } = req.query;
    const query = {};

    if (transportType && transportType !== 'all') query.transportType = transportType;
    if (status && status !== 'all') query.status = status;
    if (source) query.source = { $regex: source, $options: 'i' };
    if (destination) query.destination = { $regex: destination, $options: 'i' };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.createdAt = { $gte: start, $lt: end };
    }

    const rides = await Ride.find(query)
      .populate('user', 'username')
      .populate('driver', 'username mobileNumber profilePhoto')
      .sort('-createdAt')
      .limit(50);
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search drivers
router.get('/drivers', auth, async (req, res) => {
  try {
    const { transportType, area, rating } = req.query;
    const query = { accountStatus: true, suspended: false };

    if (transportType && transportType !== 'all') {
      query.transportTypes = transportType;
    }
    if (area) {
      query.favoriteAreas = { $regex: area, $options: 'i' };
    }

    let drivers = await Driver.find(query)
      .select('username mobileNumber favoriteAreas transportTypes ratings profilePhoto bio vehicles')
      .limit(50);

    if (rating) {
      const minRating = parseFloat(rating);
      drivers = drivers.filter(d => d.averageRating >= minRating);
    }

    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search available transports/vehicles
router.get('/transports', auth, async (req, res) => {
  try {
    const { transportType } = req.query;
    const query = { accountStatus: true, suspended: false, 'vehicles.0': { $exists: true } };

    if (transportType && transportType !== 'all') {
      query['vehicles.transportType'] = transportType;
    }

    const drivers = await Driver.find(query)
      .select('username mobileNumber vehicles ratings profilePhoto')
      .limit(50);

    const transports = [];
    drivers.forEach(d => {
      d.vehicles.forEach(v => {
        if (!transportType || transportType === 'all' || v.transportType === transportType) {
          if (v.available) {
            transports.push({
              _id: v._id,
              driver: { _id: d._id, username: d.username, mobileNumber: d.mobileNumber, profilePhoto: d.profilePhoto, averageRating: d.averageRating },
              ...v.toObject(),
            });
          }
        }
      });
    });

    res.json(transports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
