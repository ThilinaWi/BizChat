import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import User from '../models/User';
import { UserRole } from '../constants/roles';

const ADMIN_DATA = {
  firstName: 'BizChat',
  lastName: 'Admin',
  email: 'admin@bizchat.com',
  phoneNumber: '+94771234567',
  password: 'Admin@123',
  role: UserRole.ADMIN,
};

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_DATA.email });
    if (existing) {
      console.log('Admin account already exists:');
      console.log(`  Email: ${existing.email}`);
      console.log(`  Role:  ${existing.role}`);
      await mongoose.disconnect();
      return;
    }

    const admin = new User(ADMIN_DATA);
    await admin.save();

    console.log('\n Admin account created successfully!\n');
    console.log('  ┌──────────────────────────────────┐');
    console.log('  │  ADMIN LOGIN CREDENTIALS          │');
    console.log('  ├──────────────────────────────────┤');
    console.log(`  │  Email:    ${ADMIN_DATA.email}  │`);
    console.log(`  │  Password: ${ADMIN_DATA.password}         │`);
    console.log('  └──────────────────────────────────┘');
    console.log('\n Change the password after first login!\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
