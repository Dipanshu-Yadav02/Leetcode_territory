import axios from 'axios';

// Cloudflare defense: standard browser headers
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  'Referer': 'https://leetcode.com/',
  'Origin': 'https://leetcode.com',
  'Accept-Language': 'en-US,en;q=0.9',
  'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchLeetcodeUserProfile = async (username, retries = 2) => {
  const query = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          aboutMe
          userAvatar
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[LEETCODE API] Attempt ${attempt}/${retries} for user "${username}"`);
      
      const response = await axios.post(
        LEETCODE_GRAPHQL_URL,
        { query, variables: { username } },
        { 
          headers,
          timeout: 10000 // 10 second timeout
        }
      );
      
      // Check if Cloudflare returned HTML instead of JSON
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('text/html')) {
        console.error(`[LEETCODE API] ⚠️ Cloudflare blocked request (got HTML response). Attempt ${attempt}`);
        if (attempt < retries) {
          console.log(`[LEETCODE API] Waiting 3 seconds before retry...`);
          await delay(3000);
          continue;
        }
        throw new Error('Cloudflare is blocking requests. Try again later.');
      }

      // Check if the response has the expected structure
      if (!response.data || !response.data.data) {
        console.error(`[LEETCODE API] Unexpected response structure:`, JSON.stringify(response.data).substring(0, 200));
        if (attempt < retries) {
          await delay(2000);
          continue;
        }
        throw new Error('Unexpected response from LeetCode API');
      }

      console.log(`[LEETCODE API] ✅ Got valid response for "${username}"`);
      return response.data.data;
      
    } catch (error) {
      console.error(`[LEETCODE API] Error on attempt ${attempt}: ${error.message}`);
      if (attempt < retries) {
        await delay(2000);
        continue;
      }
      throw error;
    }
  }
};

