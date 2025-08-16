import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use localhost during development, switch to Render URL for live
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

export const fetchTopPlayers = async () => {
  try {
    const startTime = performance.now();
    const response = await axios.get(`${BASE_URL}/players/top`, {
      timeout: 20000, // Single 20-second timeout
    });
    const endTime = performance.now();
    console.log(`API call took ${Math.round(endTime - startTime)}ms`);
    console.log('Raw Response:', response.data);

    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Unexpected response structure or empty data:', response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching top players:", error.message, error.code, error.config?.url);
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BLOCKED_BY_CLIENT') {
      console.warn("Network error detected. Ensure the backend URL is correct and accessible.");
    } else if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out after 20 seconds. Check backend availability.');
    } else if (error.response && error.response.status === 500) {
      console.warn('Server error (500) occurred. Check backend logs.');
    } else if (error.response && error.response.status === 404) {
      console.warn('Endpoint not found. Verify the URL and backend setup.');
    }
    return []; // No mock data, just empty array
  }
};

const TrendingPlayers = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayers = async () => {
      const startTime = performance.now();
      const playersData = await fetchTopPlayers();
      const endTime = performance.now();
      console.log(`API call took ${Math.round(endTime - startTime)}ms`);

      if (playersData?.length > 0) {
        setAllPlayers(playersData);
        setLoading(false); // Only stop loading if data is received
      }
      // If data is empty or fails, loading remains true, keeping the skeleton
    };

    getPlayers();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-center text-4xl font-bold mb-10 text-gray-800">Trending <span className="text-red-500">Players</span></h2>
        <div className="md:hidden flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="min-w-[200px] bg-white rounded-xl shadow-md overflow-hidden animate-pulse p-4 text-center border border-gray-200">
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto bg-gray-300 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
        <div className="hidden md:flex justify-center flex-wrap gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-full max-w-[200px] text-center p-4 bg-gray-100 rounded-xl shadow-md animate-pulse border border-gray-200">
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 bg-gray-300"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 font-sans">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold mb-10 text-gray-800">Trending Players</h2>
        <div className="hidden lg:grid lg:grid-cols-5 gap-6 justify-items-center">
          {allPlayers.slice(0, 5).map((player) => (
            <div key={player.id} className="w-full max-w-[200px] text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                <img
                  src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                  alt={player.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
              <p className="text-sm text-gray-500">{player.position?.name}</p>
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:hidden">
          {allPlayers.slice(0, 3).map((player) => (
            <div key={player.id} className="w-full max-w-[200px] text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100 transform hover:scale-105 transition-transform duration-300">
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                <img
                  src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                  alt={player.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
              <p className="text-sm text-gray-500">{player.position?.name}</p>
            </div>
          ))}
        </div>
        <div
          className="md:hidden flex gap-4 py-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {allPlayers.slice(0, 8).map((player) => (
            <div key={player.id} className="min-w-[200px] flex-shrink-0 text-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-100">
              <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                <img
                  src={player.image_path || `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                  alt={player.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = `https://placehold.co/200x200/e5e7eb/6b7280?text=${player.fullname}`}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800">{player.fullname}</h3>
              <p className="text-sm text-gray-500">{player.position?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingPlayers;