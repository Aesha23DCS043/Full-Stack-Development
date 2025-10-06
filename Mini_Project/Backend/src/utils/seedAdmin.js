const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seedAdmin() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@luxbath.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('[seedAdmin] Skipping admin seeding: ADMIN_PASSWORD not set in environment');
    return;
  }

  // Check if an admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log(`[seedAdmin] Admin already exists with email: ${existingAdmin.email}`);
    return;
  }

  // If no admin exists, create one with configured email/password
  const hashed = await bcrypt.hash(adminPassword, 10);
  const admin = new User({
    name: 'Admin',
    email: adminEmail,
    password: hashed,
    role: 'admin',
  });
  await admin.save();
  console.log(`[seedAdmin] Admin created with email: ${adminEmail}`);
}

module.exports = seedAdmin;
