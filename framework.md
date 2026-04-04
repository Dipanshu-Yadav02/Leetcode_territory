backend/
│
├── config/                # Environment and database configurations
│   ├── db.js              # Mongoose connection logic
│   └── leetcode.js        # LeetCode API constants/endpoints
│
├── controllers/           # Core business logic for routes
│   ├── authController.js  # Registration, login, JWT generation
│   ├── verifyController.js# Handles the LeetCode "Bio-Token" handshake
│   └── mapController.js   # Contains the $geoWithin geospatial queries
│
├── jobs/                  # Background tasks and cron jobs
│   └── rankUpdater.js     # node-cron script that runs every 24h to fetch updated LeetCode ranks
│
├── middlewares/           # Express middleware functions
│   ├── authMiddleware.js  # Verifies user JWT tokens
│   └── errorMiddleware.js # Global error handling
│
├── models/                # Mongoose Database Schemas
│   └── User.js            # User schema containing the GeoJSON Point for location
│
├── routes/                # API endpoint definitions
│   ├── authRoutes.js      # /api/auth/register, /api/auth/login
│   ├── verifyRoutes.js    # /api/verify/generate-token, /api/verify/check
│   └── mapRoutes.js       # /api/map/neighbors (accepts lat, lng, radius)
│
├── services/              # External API integrations
│   └── leetcodeService.js # Uses Axios to hit [https://leetcode.com/graphql](https://leetcode.com/graphql)
│
├── utils/                 # Helper functions
│   └── tokenGenerator.js  # Generates the unique "LC-KING-XXX" verification tokens
│
├── .env                   # Environment variables (DB URI, JWT Secret, Port)
├── package.json           # Backend dependencies
└── server.js              # Main Express entry point



frontend/
│
├── public/                # Static assets
│   ├── index.html         # Root HTML file
│   └── icons/             # Crown SVGs, Map Pins, LeetCode logos
│
├── src/
│   ├── assets/            # Global stylesheets, images
│   │   └── global.css     # Tailwind directives
│   │
│   ├── components/        # Reusable UI building blocks
│   │   ├── layout/        # Navbar, Sidebar, Modals
│   │   ├── map/           # Leaflet components
│   │   │   ├── MapWidget.jsx      # The <MapContainer>
│   │   │   ├── UserMarker.jsx     # Glowing blue dot for user
│   │   │   └── RivalMarker.jsx    # Orange pins and the Crown pin
│   │   └── ui/            # Buttons, Sliders, Loading Spinners
│   │
│   ├── pages/             # Main application views
│   │   ├── Home.jsx       # Landing page
│   │   ├── Auth.jsx       # Login/Register forms
│   │   ├── Verify.jsx     # The LeetCode Token Handshake screen
│   │   └── Dashboard.jsx  # The main map and leaderboard view
│   │
│   ├── context/           # React Context API for global state
│   │   ├── AuthContext.jsx# Holds current user data and JWT
│   │   └── MapContext.jsx # Holds current location, radius, and neighbors array
│   │
│   ├── hooks/             # Custom React Hooks
│   │   ├── useGeoLocation.js  # Tracks user's live GPS coordinates
│   │   └── useNeighbors.js    # Fetches competitors when radius/location changes
│   │
│   ├── services/          # API calls to your Express backend
│   │   └── api.js         # Axios instance with base URL and JWT interceptors
│   │
│   ├── utils/             # Frontend helpers
│   │   └── distanceCalc.js# Formats distances (e.g., "1.2 km away")
│   │
│   ├── App.jsx            # Main router configuration (react-router-dom)
│   └── main.jsx           # React DOM render point
│
├── .env                   # Frontend env vars (e.g., VITE_API_BASE_URL)
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration (colors, fonts)
└── vite.config.js         # Build tool configuration (if using Vite)