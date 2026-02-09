const express = require('express');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { rideId, revieweeId, revieweeRole, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const reviewerModel = req.user.role === 'user' ? 'User' : 'Driver';
    const revieweeModel = revieweeRole === 'user' ? 'User' : 'Driver';

    const review = await Review.create({
      ride: rideId,
      reviewer: req.user.id,
      reviewerModel,
      reviewerRole: req.user.role,
      reviewee: revieweeId,
      revieweeModel,
      revieweeRole,
      rating,
      comment: comment || '',
    });

    // Emit notification
    const io = req.app.get('io');
    if (io) {
      io.to(`${revieweeRole}_${revieweeId}`).emit('notification', {
        type: 'new_review',
        title: 'Nouvel avis',
        body: `Vous avez reçu une note de ${rating}/5`,
        relatedId: rideId,
      });
    }

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this ride' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a target user/driver
router.get('/for/:targetId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.targetId })
      .populate('reviewer', 'username')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a ride
router.get('/ride/:rideId', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ ride: req.params.rideId })
      .populate('reviewer', 'username')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my reviews
router.get('/my', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate('reviewee', 'username')
      .sort('-createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
