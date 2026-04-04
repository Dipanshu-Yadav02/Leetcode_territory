# 👑 LeetCode Territory: Product & Design Specification
**Version:** 1.0
**Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
**Core Concept:** A geospatial social game for developers. "Pokémon GO meets LeetCode."

---

## 1. Executive Summary
LeetCode Territory is a location-based competitive platform that gamifies the solitary act of solving algorithm problems. By leveraging GPS data and the LeetCode GraphQL API, users compete not against a faceless global leaderboard, but against their actual neighbors. The user with the highest Global Rank within a customizable physical radius is crowned the "King" or "Queen" of that territory. 

---

## 2. Technical Architecture (MERN Stack)
* **Frontend:** React.js, Tailwind CSS (for styling), React-Leaflet (for mapping), Framer Motion (for animations).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (using `Point` schemas and `2dsphere` indexes for geospatial queries).
* **Background Jobs:** `node-cron` for daily rank syncing.

---

## 3. UI/UX Design Specifications

### 3.1. General Theming & Vibe
* **Color Palette:** Dark Mode by default. Backgrounds in deep slate/charcoal (`#121212`). Accents in **LeetCode Orange** (`#FFA116`) for primary actions and **Neon Green** (`#00FF00`) for map highlights and success states.
* **Typography:** A clean sans-serif like *Inter* or *Roboto* for UI elements, and a monospace font like *Fira Code* for usernames, ranks, and tokens.
* **UI Style:** Glassmorphism for overlays (floating panels over the map) to maximize map visibility.

### 3.2. User Flow & Screen Breakdown

#### A. The Onboarding & Verification Flow
**Visuals:** A split-screen layout. Left side features a spinning 3D globe with code snippets; right side is the interactive form.
* **Screen 1: Standard Auth**
    * Fields: `Email`, `Password`, `LeetCode Username`.
    * Button: `[ Create Account ]` (Solid Orange).
* **Screen 2: The Handshake (Verification)**
    * **UI Element:** A glowing terminal box displaying the generated Verification Token (e.g., `LC-KING-9842A`).
    * **Button:** `[ 📋 Copy Token ]`
    * **Instructions:** Step-by-step numbered list instructing the user to paste this into their LeetCode "About Me" section.
    * **Button:** `[ 🔍 Verify My Account ]` (Pings the Express backend to scrape the LeetCode GraphQL API).
    * **State:** A loading spinner morphs into a green checkmark upon success.

#### B. The Main Map Dashboard (Core View)
This is the primary interface. The map takes up 100% of the viewport (fullscreen), with floating UI elements on top.

**1. The Top Navigation Bar (Floating Glass Panel)**
* **Left:** App Logo (a crown intertwined with a map pin).
* **Center:** Current Status Banner. (e.g., *"👑 King of Downtown"* or *"⚔️ Challenger"*).
* **Right:** User Avatar, current Global Rank prominently displayed, and a `[ ⚙️ Settings ]` icon.

**2. The Map Area (React-Leaflet)**
* **Style:** Dark map tiles (e.g., CartoDB Dark Matter) to make the orange and green pins pop.
* **User Pin:** A pulsing blue dot indicating live GPS location. 
* **The Influence Circle:** A semi-transparent green overlay centered on the user pin.
* **Rival Pins:** Standard orange markers.
* **The King Pin:** If someone else is the King, their pin is larger and features a golden crown floating above it.

**3. The Radar Control (Bottom Center)**
* **Feature:** A curved, modern slider to control the "Influence Radius".
* **Options:** Snap points at `1km`, `5km`, `10km`, `25km`.
* **Live Feedback:** As the slider moves, the map circle grows/shrinks dynamically, and a tiny badge updates: *"Searching 5km radius..."*

**4. The Local Leaderboard Drawer (Right Side Panel)**
* **Behavior:** Collapsible panel. 
* **Header:** "Territory Standings".
* **List Items:** Ranks 1 through 10 in the current circle.
    * #1 receives a yellow highlight and crown icon.
    * User's own name is highlighted in bold.
* **Data Points shown:** Avatar, Username, Global Rank, and "Distance from you" (e.g., *1.2km away*).

#### C. The Player Profile Modal
Triggered when clicking a Rival Pin on the map or a name in the Leaderboard.
* **Header:** Big Avatar, Username, and their current local title ("Knight", "Queen", etc.).
* **Stats Grid:**
    * Global Rank
    * Problems Solved (Easy / Medium / Hard with progress bars).
    * Acceptance Rate.
* **Action Button:** `[ ⚔️ Challenge ]` (Sends a push notification to the user saying "User X is coming for your crown!").

---

## 4. Specific Button Interactions & Behaviors

| Button / Control | Location | Action | UX Feedback |
| :--- | :--- | :--- | :--- |
| **`[ 🔍 Verify ]`** | Onboarding | Triggers GraphQL API call. | Button turns into a loading spinner. If fail, red shake animation. If success, green glow and redirects to Map. |
| **`[ 🎯 Recenter ]`** | Map (Bottom Right) | Snaps map back to user's live GPS coordinates. | Smooth fly-to animation using Leaflet's `flyTo` method. |
| **`Radius Slider`** | Map (Bottom Center)| Updates MongoDB `$centerSphere` query radius. | Map circle resizes instantly. Leaderboard updates with a skeleton loader briefly before populating new rivals. |
| **`[ ⚔️ Challenge ]`** | Profile Modal | Pings backend to send a "Rivalry Alert" notification. | Button text changes to `[ 🛡️ Challenge Sent ]` and disables. |
| **`[ 🏆 Claim Crown ]`**| Map Banner | Appears ONLY if the territory is empty. | Confetti animation fires, user's pin upgrades to a Crown pin. |

---

## 5. Background Sync & Notification UX

Since the backend `node-cron` job runs daily to fetch updated ranks, the user experience upon opening the app the next day needs to be dramatic.

* **The "Dethroned" Alert:** If the cron job detects that a user lost their #1 spot overnight, the next time they open the app, the screen is tinted red. A modal pops up: 
    * **Text:** *"🚨 YOU HAVE BEEN DETHRONED! [Rival_Name] solved 5 problems last night and surpassed your rank. Reclaim your territory!"*
    * **Button:** `[ Go to LeetCode ]` (External link).
* **The "Defense" Alert:** *"🛡️ Crown Defended! You maintained your rank. 3 challengers in your area are closing in."*

---

## 6. Future Gamification Scope
* **Territory History:** A log showing how many days you've held the crown in a specific area.
* **Heatmaps:** Visualizing areas of the city with the highest density of top-ranked coders.
* **Guilds:** Allowing users to form teams (e.g., "University Coding Club") to control larger swaths of the map together.
