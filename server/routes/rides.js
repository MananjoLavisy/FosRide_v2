const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── User: Request a ride ───
router.post('/', auth, requireRole('user'), async (req, res) => {
  try {
    const { source, destination, passengerCount } = req.body;
    const user = await User.findById(req.user.id);

    let discount = 0;
    if (user.rideCount === 0) discount = 10;           // first ride 10% off
    if (passengerCount === 2) discount = Math.max(discount, 5);  // 2 passengers 5% off

    const ride = await Ride.create({
      user: user._id,
      source,
      destination,
      passengerCount: passengerCount || 1,
      discount,
    });

    user.rideCount += 1;
    await user.save();

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── User: Get my rides ───
router.get('/my', auth, requireRole('user'), async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('driver', 'username mobileNumber')
      .populate('driverOffers.driver', 'username')
      .sort('-createdAt');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Driver: List available rides (matching favorite areas) ───
router.get('/available', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    const query = { status: 'pending' };
    if (driver.favoriteAreas.length > 0) {
      query.source = { $in: driver.favoriteAreas };
    }
    const rides = await Ride.find(query)
      .populate('user', 'username mobileNumber')
      .sort('-createdAt');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Driver: List ALL pending rides ───
router.get('/all-pending', auth, requireRole('driver'), async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending' })
      .populate('user', 'username mobileNumber')
      .sort('-createdAt');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Driver: Suggest price for a ride ───
router.post('/:rideId/offer', auth, requireRole('driver'), async (req, res) => {
  try {
    const { price } = req.body;
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    // Add driver's offer
    ride.driverOffers.push({ driver: req.user.id, price });
    ride.status = 'offered';
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── User: Accept a driver's offer ───
router.post('/:rideId/accept', auth, requireRole('user'), async (req, res) => {
  try {
    const { driverId, price } = req.body;
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.driver = driverId;
    ride.price = ride.discount > 0 ? Math.round(price * (1 - ride.discount / 100)) : price;
    ride.status = 'accepted';
    await ride.save();

    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get single ride ───
router.get('/:rideId', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('user', 'username mobileNumber')
      .populate('driver', 'username mobileNumber')
      .populate('driverOffers.driver', 'username');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
