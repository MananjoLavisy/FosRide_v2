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

// ─── Update driver profile ───
router.put('/profile', auth, requireRole('driver'), async (req, res) => {
  try {
    const { bio, language, profilePhoto } = req.body;
    const driver = await Driver.findById(req.user.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (bio !== undefined) driver.bio = bio;
    if (language) driver.language = language;
    if (profilePhoto !== undefined) driver.profilePhoto = profilePhoto;
    await driver.save();

    const updated = await Driver.findById(req.user.id).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Add vehicle ───
router.post('/vehicles', auth, requireRole('driver'), async (req, res) => {
  try {
    const { transportType, name, description, photos, capacity, pricePerKm, priceRange } = req.body;
    const driver = await Driver.findById(req.user.id);
    driver.vehicles.push({ transportType, name, description, photos: photos || [], capacity, pricePerKm, priceRange });
    await driver.save();
    res.status(201).json(driver.vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Update vehicle ───
router.put('/vehicles/:id', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    const vehicle = driver.vehicles.id(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const { transportType, name, description, photos, capacity, pricePerKm, priceRange, available } = req.body;
    if (transportType) vehicle.transportType = transportType;
    if (name !== undefined) vehicle.name = name;
    if (description !== undefined) vehicle.description = description;
    if (photos) vehicle.photos = photos;
    if (capacity !== undefined) vehicle.capacity = capacity;
    if (pricePerKm !== undefined) vehicle.pricePerKm = pricePerKm;
    if (priceRange !== undefined) vehicle.priceRange = priceRange;
    if (available !== undefined) vehicle.available = available;
    await driver.save();
    res.json(driver.vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Delete vehicle ───
router.delete('/vehicles/:id', auth, requireRole('driver'), async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id);
    driver.vehicles = driver.vehicles.filter(v => v._id.toString() !== req.params.id);
    await driver.save();
    res.json(driver.vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Get driver's vehicles (public) ───
router.get('/:driverId/vehicles', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId).select('vehicles');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver.vehicles);
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

// ─── Update transport types ───
router.put('/transport-types', auth, requireRole('driver'), async (req, res) => {
  try {
    const { transportTypes } = req.body;
    const valid = ['voiture', 'taxi', 'moto', 'bateau', 'lakana'];
    const filtered = (transportTypes || []).filter(t => valid.includes(t));
    const driver = await Driver.findById(req.user.id);
    driver.transportTypes = filtered;
    await driver.save();
    res.json({ transportTypes: driver.transportTypes });
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

// ─── List all drivers (public) ───
router.get('/', auth, async (req, res) => {
  try {
    const drivers = await Driver.find({ accountStatus: true, suspended: false })
      .select('username mobileNumber favoriteAreas transportTypes ratings profilePhoto bio');
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

// ─── Get a specific driver ───
router.get('/:driverId', auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.driverId)
      .select('username mobileNumber favoriteAreas transportTypes ratings profilePhoto bio vehicles');
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
