import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const cleanAndSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for fresh seeding...');

    // Delete any previous users that the seed might conflict with
    const emailsToDelete = [
      'dishu@territory.com', 
      'dishuyadav@example.com',
      'developer@city.com',
      'king@dummy.com',
      'challenger@dummy.com',
      'noob@dummy.com'
    ];
    
    await User.deleteMany({
      $or: [
        { email: { $in: emailsToDelete } },
        { leetcodeUsername: { $in: ['dishuyadav477', 'dummy_king_1', 'challenger_2', 'noob_coder_3'] } }
      ]
    });
    console.log('🧹 Cleaned up old seed data.');

    const password = 'territory123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const baseLng = 72.925646;
    const baseLat = 22.552679;

    const dummyData = [
      {
        email: 'dishu@territory.com',
        leetcodeUsername: 'dishuyadav477',
        verificationToken: 'SEED-TOKEN-MAIN',
        isVerified: true,
        leetcodeGlobalRank: 420,
        location: { type: 'Point', coordinates: [baseLng, baseLat] },
        password: hashedPassword
      },
      {
        email: 'king@dummy.com',
        leetcodeUsername: 'dummy_king_1',
        verificationToken: 'SEED-1',
        isVerified: true,
        leetcodeGlobalRank: 10,
        location: { type: 'Point', coordinates: [baseLng + 0.005, baseLat + 0.003] },
        password: hashedPassword
      },
      {
        email: 'challenger@dummy.com',
        leetcodeUsername: 'challenger_2',
        verificationToken: 'SEED-2',
        isVerified: true,
        leetcodeGlobalRank: 800,
        location: { type: 'Point', coordinates: [baseLng - 0.015, baseLat + 0.005] },
        password: hashedPassword
      },
      {
        email: 'noob@dummy.com',
        leetcodeUsername: 'noob_coder_3',
        verificationToken: 'SEED-3',
        isVerified: true,
        leetcodeGlobalRank: 9999,
        location: { type: 'Point', coordinates: [baseLng - 0.002, baseLat - 0.02] },
        password: hashedPassword
      }
    ];

    for (const d of dummyData) {
      await User.create(d);
      console.log(`✅ Created user: ${d.leetcodeUsername}`);
    }

    console.log('\n🎉 Fresh Seeding Complete!');
    console.log('🟢 You can now login on http://localhost:5173/auth');
    console.log('📧 Email: dishu@territory.com');
    console.log('🔑 Password: territory123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

cleanAndSeed();
