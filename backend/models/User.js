import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    leetcodeUsername: { type: String, required: true, unique: true },
    verificationToken: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    leetcodeGlobalRank: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      }
    }
  },
  { timestamps: true }
);

// GeoSpatial index for location
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
export default User;
