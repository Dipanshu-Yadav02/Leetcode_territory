import cron from 'node-cron';
import { fetchLeetcodeUserProfile } from '../services/leetcodeService.js';
// Replace with actual User model import once created
// import User from '../models/User.js'; 

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const scheduleRankUpdater = () => {
  // Run everyday at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('CRON: Starting daily LeetCode rank update...');
    try {
      // Mocked fetching logic until Database is hooked up
      // const allVerifiedUsers = await User.find({ isVerified: true });
      const allVerifiedUsers = []; 
      
      console.log(`Found ${allVerifiedUsers.length} users to update.`);

      for (const user of allVerifiedUsers) {
        try {
          console.log(`Updating rank for ${user.leetcodeUsername}...`);
          const data = await fetchLeetcodeUserProfile(user.leetcodeUsername);
          
          if (data && data.matchedUser) {
             const newRanking = data.matchedUser.profile.ranking;
             // We will update the user's DB doc with newest ranking here
             // await User.findByIdAndUpdate(user._id, { leetcodeGlobalRank: newRanking });
             console.log(`Successfully updated rank for ${user.leetcodeUsername}: ${newRanking}`);
          }
        } catch (err) {
          console.error(`Failed to update rank for ${user.leetcodeUsername}`, err);
        }
        
        // CRITICAL DEFFENSE: Throttling request per user instruction
        await sleep(3000); 
      }
      
      console.log('CRON: Daily LeetCode rank update complete.');
    } catch (error) {
      console.error('CRON: Error running rank updater', error);
    }
  });
};
