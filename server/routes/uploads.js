const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Upload profile photo
router.post('/profile-photo', auth, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, url: `/api/uploads/${req.file.filename}` });
});

// Upload vehicle photo
router.post('/vehicle-photo', auth, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ filename: req.file.filename, url: `/api/uploads/${req.file.filename}` });
});

// Serve uploaded file
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }
  res.sendFile(filePath);
});

module.exports = router;
