import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MatchCard from '../components/MatchCard';
import MatchCardSkeleton from '../components/MatchCardSkeleton';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

export default function StadiumPage() {
  const { isDarkMode } = useTheme();
  const [featuredMatch, setFeaturedMatch] = useState(null);
  const [venues, setVenues] = useState([]);
  const [trendingVenues, setTrendingVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const liveMatches = await axios.get(`${BASE_URL}/matches/live`, { timeout: 10000 });
        const upcomingMatches = await axios.get(`${BASE_URL}/matches/upcoming`, { timeout: 10000 });
        const matches = [...(liveMatches.data || []), ...(upcomingMatches.data || [])];
        setFeaturedMatch(matches[0] || null);

        const venuesResponse = await axios.get(`${BASE_URL}/venues`, { timeout: 10000 });
        console.log('API Response Venues:', venuesResponse.data);
        const allVenues = Array.isArray(venuesResponse.data) ? venuesResponse.data : [];
        setVenues(allVenues);
        // Select first 5 venues as trending (or implement logic based on matches)
        setTrendingVenues(allVenues.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(`Failed to load data. ${err.message || 'Please try again.'}`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <MatchCardSkeleton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <MatchCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || (!featuredMatch && venues.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-red-600 text-lg dark:text-red-400">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <meta name="description" content="Explore cricket stadiums with details on capacity, location, and more." />
      <meta name="keywords" content="cricket stadiums, venue details, cricket grounds" />
      <meta name="robots" content="index, follow" />
      <title>Cricket Stadiums</title>
      <div className="container mx-auto px-6 py-8">
        {/* Featured Match Card */}
        <div className="mb-6">
          {featuredMatch ? (
            <MatchCard match={featuredMatch} activeFilter={featuredMatch.status === 'Live' ? 'live' : 'upcoming'} />
          ) : (
            <div className="bg-gray-200 rounded-xl p-4 text-center text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              No featured match available.
            </div>
          )}
        </div>

        {/* Main Content with Grid and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stadiums Grid */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-gray-100">Cricket Stadiums</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/stadium/${venue.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-lg p-4 w-full font-open-sans break-words hover:shadow-xl transition-shadow duration-200 dark:bg-gray-800 dark:shadow-gray-700">
                    <img
                      src={venue.image_path || '/stadium.jpg'}
                      alt={venue.name}
                      className="w-full h-32 object-cover rounded-t-xl mb-2"
                    />
                    <h3 className="text-lg font-bold text-gray-800 mb-1 dark:text-gray-200">{venue.name}</h3>
                    <p className="text-sm text-gray-600 mb-1 dark:text-gray-400">{venue.city || 'Unknown City'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Capacity: {venue.capacity || 'N/A'}</p>
                    <div className="mt-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        venue.floodlight ? 'text-green-500 bg-green-50' : 'text-gray-500 bg-gray-100'
                      } dark:text-green-400 dark:bg-green-900`}>
                        {venue.floodlight ? 'Floodlit' : 'Non-Floodlit'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Stadiums Sidebar */}
          <div className="lg:w-80">
            <h2 className="text-xl font-bold text-gray-900 mb-4 dark:text-gray-100">Trending Stadiums</h2>
            <div className="space-y-4">
              {trendingVenues.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/stadium/${venue.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-lg p-4 w-full font-open-sans break-words hover:shadow-xl transition-shadow duration-200 dark:bg-gray-800 dark:shadow-gray-700">
                    <img
                      src={venue.image_path || '/stadium.jpg'}
                      alt={venue.name}
                      className="w-full h-24 object-cover rounded-t-xl mb-2"
                    />
                    <h3 className="text-base font-bold text-gray-800 mb-1 dark:text-gray-200">{venue.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{venue.city || 'Unknown City'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}