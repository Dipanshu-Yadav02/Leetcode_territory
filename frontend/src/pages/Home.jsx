import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-leetcode-bg">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          LeetCode <span className="text-leetcode-orange">Territory</span> 👑
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
          A geospatial social game for developers. Pokémon GO meets LeetCode. Don't just rank up globally—conquer your local territory.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-block bg-leetcode-orange text-white font-semibold py-3 px-8 rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20"
        >
          Enter the Map
        </Link>
      </div>
    </div>
  );
};

export default Home;
