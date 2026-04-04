import Navbar from '../components/layout/Navbar';
import RadiusSlider from '../components/ui/RadiusSlider';
import LeaderboardDrawer from '../components/map/LeaderboardDrawer';
import MapWidget from '../components/map/MapWidget';
import { MapProvider } from '../context/MapContext';

const Dashboard = () => {
  return (
    <MapProvider>
      <div className="h-screen w-full relative bg-leetcode-bg overflow-hidden">
        
        {/* Floating UI Elements */}
        <Navbar />
        <LeaderboardDrawer />
        <RadiusSlider />

        {/* Underlay Map */}
        <MapWidget />

      </div>
    </MapProvider>
  );
};

export default Dashboard;
