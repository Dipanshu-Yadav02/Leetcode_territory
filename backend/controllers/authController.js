import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateLCKingToken } from '../utils/tokenGenerator.js';

export const register = async (req, res) => {
  try {
    const { email, password, leetcodeUsername } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { leetcodeUsername }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or LeetCode Username already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate LC-KING token
    const verificationToken = generateLCKingToken();

    // Create user object without location (yet)
    const newUser = new User({
      email,
      password: hashedPassword,
      leetcodeUsername,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();

    // Issue JWT immediately so they can proceed to verify step
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        leetcodeUsername: newUser.leetcodeUsername,
        isVerified: newUser.isVerified,
        verificationToken: newUser.verificationToken,
        location: newUser.location ? newUser.location.coordinates : null,
        leetcodeGlobalRank: newUser.leetcodeGlobalRank
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
        isVerified: user.isVerified,
        verificationToken: user.verificationToken,
        location: user.location ? user.location.coordinates : null,
        leetcodeGlobalRank: user.leetcodeGlobalRank
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user.id).select('-password').lean();
    if (user.location && user.location.coordinates) {
      user.location = user.location.coordinates;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error reading profile' });
  }
};
