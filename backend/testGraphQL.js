import axios from 'axios';
import fs from 'fs';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Content-Type': 'application/json',
  'Referer': 'https://leetcode.com/',
  'Origin': 'https://leetcode.com'
};

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

try {
  const response = await axios.post(
    'https://leetcode.com/graphql',
    { query, variables: { username: 'dishuyadav477' } },
    { headers }
  );
  fs.writeFileSync('graphql_result.json', JSON.stringify(response.data, null, 2));
  console.log('Result written to graphql_result.json');
} catch (error) {
  console.error('ERROR:', error.response?.status, error.response?.data || error.message);
}
