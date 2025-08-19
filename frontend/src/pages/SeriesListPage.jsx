import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesListPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/seasons`, {
          params: { include: 'league', sort: 'name' },
        });
        setSeasons(response.data.data || []);
      } catch (err) {
        setError('Failed to load seasons');
        console.error('Error fetching seasons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-8"><p className="text-center text-[#122e47]">Loading...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-8"><p className="text-center text-red-500">{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#122e47] mb-6">Cricket Seasons</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map((season) => (
            <Link key={season.id} to={`/series/${season.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-[#122e47]">{season.name}</h2>
                <p className="text-gray-600">League: {season.league?.name || 'N/A'}</p>
                <p className="text-gray-600">Year: {season.year || 'N/A'}</p>
                <p className="text-sm text-red-500 mt-2">View Details</p>
              </div>
            </Link>
          ))}
          {seasons.length === 0 && <p className="text-[#122e47] text-center">No seasons available.</p>}
        </div>
      </div>
    </div>
  );
};

export default SeriesListPage;