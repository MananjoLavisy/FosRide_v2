const express = require('express');
const Driver = require('../models/Driver');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// ─── Get current driver profile ───
router.get('/me', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-password');
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Add favorite area ───
router.post('/favorite-area', auth, requireRole('driver'), async (req, res) => {
  try {
    const { area } = req.body;
    const driver = await Driver.findById(req.user.id);
    if (!driver.favoriteAreas.includes(area)) {
      driver.favoriteAreas.push(area);
      await driver.save();
    }
    res.json({ favoriteAreas: driver.favoriteAreas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Remove favorite area ───
router.delete('/favorite-area/:area', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    driver.favoriteAreas = driver.favoriteAreas.filter(a => a !== req.params.area);
    await driver.save();
    res.json({ favoriteAreas: driver.favoriteAreas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get driver's ratings ───
router.get('/ratings', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    res.json({ ratings: driver.ratings, averageRating: driver.averageRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── List all drivers (public, for users to rate) ───
router.get('/', auth, async (req, res) => {
  try {
    const drivers = await Driver.find({ accountStatus: true, suspended: false })
      .select('username mobileNumber favoriteAreas ratings');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Rate a driver ───
router.post('/:driverId/rate', auth, requireRole('user'), async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const driver = await Driver.findById(req.params.driverId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.ratings.push(rating);
    await driver.save();

    res.json({ message: `Rated ${driver.username} with ${rating}`, averageRating: driver.averageRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get a specific driver's average rating ───
router.get('/:driverId', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId)
      .select('username mobileNumber favoriteAreas ratings');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
