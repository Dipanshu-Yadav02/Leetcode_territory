import User from '../models/User.js';

export const getNeighbors = async (req, res) => {
  try {
    const { lat, lng, radiusInKm = 5 } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Convert radius from kilometers to radians (Earth radius is approx 6378.1 km)
    const radiusInRadians = radiusInKm / 6378.1;

    // Use MongoDB GeoSpatial queries to find users within the radius
    // We only want verified users.
    const neighbors = await User.find({
      isVerified: true,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians]
        }
      }
    })
    .select('leetcodeUsername leetcodeGlobalRank location') // only pull necessary data
    .sort({ leetcodeGlobalRank: 1 }) // sort ascending (1 is best)
    .lean(); // Faster query read

    res.json(neighbors);

  } catch (error) {
    console.error('Error fetching neighbors:', error);
    res.status(500).json({ message: 'Server error while fetching map data' });
  }
};
