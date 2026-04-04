import User from '../models/User.js';
import { fetchLeetcodeUserProfile } from '../services/leetcodeService.js';

export const verifyLeetcodeToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    // Ensure GPS coordinates were sent in req.body
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'GPS coordinates are required for verification' });
    }

    // Ping LeetCode GraphQL
    const usernameToQuery = user.leetcodeUsername.trim();
    console.log(`[VERIFY] Querying LeetCode for username: "${usernameToQuery}"`);

    let data;
    try {
      data = await fetchLeetcodeUserProfile(usernameToQuery);
    } catch (apiError) {
      console.error(`[VERIFY] LeetCode API call failed for "${usernameToQuery}":`, apiError.message);
      return res.status(502).json({ 
        message: `Could not reach LeetCode API. Please try again in a few seconds.` 
      });
    }

    if (!data || !data.matchedUser) {
      console.error(`[VERIFY] LeetCode returned null for username: "${usernameToQuery}"`);
      return res.status(404).json({ 
        message: `LeetCode profile "${usernameToQuery}" not found. Make sure your LeetCode username is spelled exactly right (case-sensitive).` 
      });
    }

    const { aboutMe, ranking } = data.matchedUser.profile;
    console.log(`[VERIFY] Found profile. aboutMe: "${aboutMe}", ranking: ${ranking}`);
    console.log(`[VERIFY] Looking for token: "${user.verificationToken}"`);

    // Check if the generated verificationToken is in their bio
    if (aboutMe && aboutMe.includes(user.verificationToken)) {
      // Success! Update User
      user.isVerified = true;
      user.leetcodeGlobalRank = ranking;
      user.location = {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
      };
      
      await user.save();
      
      console.log(`[VERIFY] ✅ User "${usernameToQuery}" verified successfully! Rank: ${ranking}`);
      return res.json({ 
        message: 'Verification successful', 
        isVerified: true, 
        leetcodeGlobalRank: ranking 
      });
    } else {
      console.log(`[VERIFY] ❌ Token mismatch. aboutMe="${aboutMe}", expected="${user.verificationToken}"`);
      return res.status(400).json({ 
        message: `Verification token not found in your LeetCode "About Me". Make sure you pasted "${user.verificationToken}" exactly.` 
      });
    }

  } catch (error) {
    console.error('[VERIFY] Unexpected error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
};
