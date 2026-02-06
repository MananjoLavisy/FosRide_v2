require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const User = require('./models/User');
const Driver = require('./models/Driver');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Admin 1: admin / dabou ──
  if (!(await Admin.findOne({ username: 'admin' }))) {
    await Admin.create({ username: 'admin', password: 'dabou' });
    console.log('Created ADMIN  ->  admin / dabou');
  } else {
    console.log('Admin "admin" already exists');
  }

  // ── Admin 2: admin2 / Lavisy ──
  if (!(await Admin.findOne({ username: 'admin2' }))) {
    await Admin.create({ username: 'admin2', password: 'Lavisy' });
    console.log('Created ADMIN  ->  admin2 / Lavisy');
  } else {
    console.log('Admin "admin2" already exists');
  }

  // ── Test user account for admin ──
  if (!(await User.findOne({ username: 'admin' }))) {
    await User.create({
      username: 'admin',
      email: 'admin@fosaride.com',
      password: 'dabou',
      mobileNumber: '0000000000',
    });
    console.log('Created USER   ->  admin / dabou');
  } else {
    console.log('User "admin" already exists');
  }

  // ── Test driver account for admin ──
  if (!(await Driver.findOne({ username: 'admin' }))) {
    await Driver.create({
      username: 'admin',
      email: 'admin@fosaride.com',
      password: 'dabou',
      mobileNumber: '0000000000',
      driverLicense: 'TEST-LICENSE-001',
      nationalID: 'TEST-NID-001',
      accountStatus: true,
      suspended: false,
    });
    console.log('Created DRIVER ->  admin / dabou  (pre-approved)');
  } else {
    console.log('Driver "admin" already exists');
  }

  await mongoose.disconnect();
  console.log('\nSeed complete!');
  console.log('  Admin 1:  admin  / dabou');
  console.log('  Admin 2:  admin2 / Lavisy');
  console.log('  (admin credentials auto-detected at login — no need to select Admin role)');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
