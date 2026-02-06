const express = require('express');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');

const router = express.Router();

// ─── Register User ───
router.post('/register/user', async (req, res) => {
  try {
    const { username, email, password, mobileNumber } = req.body;
    if (await User.findOne({ $or: [{ username }, { email }] })) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const user = await User.create({ username, email, password, mobileNumber });
    res.status(201).json({ user: { id: user._id, username: user.username, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Register Driver (pending approval) ───
router.post('/register/driver', async (req, res) => {
  try {
    const { username, email, password, mobileNumber, driverLicense, nationalID } = req.body;
    if (await Driver.findOne({ $or: [{ username }, { email }] })) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    await Driver.create({ username, email, password, mobileNumber, driverLicense, nationalID });
    res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Login ───
// Only "user" and "driver" are shown in the UI.
// Admin is auto-detected: if the username matches an admin account, login as admin.
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Always check admin first — hidden admin auto-detect
    const adminAccount = await Admin.findOne({ username });
    if (adminAccount) {
      const isMatch = await adminAccount.comparePassword(password);
      if (isMatch) {
        return res.json({
          user: { id: adminAccount._id, username: adminAccount.username, role: 'admin' },
        });
      }
    }

    // Otherwise proceed with selected role
    let account;
    if (role === 'user') {
      account = await User.findOne({ username });
    } else if (role === 'driver') {
      account = await Driver.findOne({ username });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!account) {
      return res.status(401).json({ message: 'Account does not exist' });
    }

    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    if (role === 'driver') {
      if (account.suspended) {
        return res.status(403).json({ message: 'Account has been suspended' });
      }
      if (!account.accountStatus) {
        return res.status(403).json({ message: 'Account not yet activated. Waiting for admin approval.' });
      }
    }

    res.json({
      user: { id: account._id, username: account.username, role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
