require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('../models/admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL / ADMIN_PASSWORD missing in .env');
    }

    // look for existing admin by e-mail
    let admin = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (!admin) {
      admin = await Admin.create({
        email   : ADMIN_EMAIL,
        password: ADMIN_PASSWORD         // hashed in model hook
      });
      console.log(`👑  Default Admin created  (adminId=${admin.adminId})`);
    } else {
      console.log(`👑  Admin already present (adminId=${admin.adminId})`);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
