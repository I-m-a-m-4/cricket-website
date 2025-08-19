import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MatchCard from '../components/MatchCard';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

// Retry logic for API requests
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, { ...options, timeout: 15000 });
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default function StadiumDetailPage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let venueData = null;
        let liveMatchesData = [];
        let upcomingMatchesData = [];
        let recentMatchesData = [];

        try {
          const venueResponse = await fetchWithRetry(`${BASE_URL}/venues/${id}?include=country`, {});
          venueData = venueResponse.data;
        } catch (err) {
          console.warn('Failed to fetch venue:', err.message);
        }

        try {
          const liveResponse = await fetchWithRetry(`${BASE_URL}/matches/live`, {});
          liveMatchesData = Array.isArray(liveResponse.data) ? liveResponse.data.filter(m => m.venue_id === parseInt(id)) : [];
        } catch (err) {
          console.warn('Failed to fetch live matches:', err.message);
        }

        try {
          const upcomingResponse = await fetchWithRetry(`${BASE_URL}/matches/upcoming`, {});
          upcomingMatchesData = Array.isArray(upcomingResponse.data) ? upcomingResponse.data.filter(m => m.venue_id === parseInt(id)) : [];
        } catch (err) {
          console.warn('Failed to fetch upcoming matches:', err.message);
        }

        try {
          const recentResponse = await fetchWithRetry(`${BASE_URL}/matches/recent`, {});
          recentMatchesData = Array.isArray(recentResponse.data) ? recentResponse.data.filter(m => m.venue_id === parseInt(id)) : [];
        } catch (err) {
          console.warn('Failed to fetch recent matches:', err.message);
        }

        setVenue(venueData);
        setLiveMatches(liveMatchesData);
        setUpcomingMatches(upcomingMatchesData);
        setRecentMatches(recentMatchesData);
        setLoading(false);

        if (!venueData && liveMatchesData.length === 0 && upcomingMatchesData.length === 0 && recentMatchesData.length === 0) {
          setError('No data available for this stadium.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.response?.data?.error || 'Failed to load stadium details.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredMatches = (matches) => {
    return matches.filter((match) =>
      match.localteam?.name.toLowerCase().includes(search.toLowerCase()) ||
      match.visitorteam?.name.toLowerCase().includes(search.toLowerCase()) ||
      match.league?.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const currentMatches = activeTab === 'live' ? filteredMatches(liveMatches) : activeTab === 'upcoming' ? filteredMatches(upcomingMatches) : filteredMatches(recentMatches);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-red-500 text-lg">{error || 'Stadium not found'}</p>
          <Link to="/stadiums" className="mt-4 inline-block text-[#122537] hover:underline">
            ← Back to Stadiums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <meta name="description" content={`Explore details of ${venue.name}, including matches, location, and more.`} />
      <meta name="keywords" content={`cricket stadium, ${venue.name}, cricket matches, venue details`} />
      <meta name="robots" content="index, follow" />
      <title>{venue.name} - Stadium Details</title>
      <div className="container mx-auto px-6 py-8">
        <nav className="text-base text-[#122537] mb-6 font-medium" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex items-center space-x-2">
            <li className="flex items-center">
              <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
              <span className="mx-2 text-[#122537]">&gt;</span>
            </li>
            <li className="flex items-center">
              <Link to="/stadiums" className="hover:text-red-500 transition-colors">Cricket Stadiums</Link>
              <span className="mx-2 text-[#122537]">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-[#122537]">{venue.name}</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl font-extrabold text-[#122537] mb-8">
          <span className="text-red-500">{venue.name}</span> Details
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="relative w-full h-96 bg-gray-200 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={venue.image_path || '/icc.jpg'}
                alt={venue.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => { e.target.src = '/icc.jpg'; }}
              />
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
                <span className="text-[#122537] font-semibold text-lg">{venue.name}</span>
              </div>
            </div>
          </div>
          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
              <h2 className="text-2xl font-semibold text-[#122537] mb-4">{venue.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <p className="text-[#122537]">
                  <strong>Location:</strong> {venue.city || 'N/A'}, {venue.country?.name || venue.country_name || 'N/A'}
                </p>
                <p className="text-[#122537]">
                  <strong>Capacity:</strong> {venue.capacity || 'N/A'}
                </p>
                <p className="text-[#122537]">
                  <strong>Floodlights:</strong> {venue.floodlight ? 'Yes' : 'No'}
                </p>
                <p className="text-[#122537]">
                  <strong>Established:</strong> {venue.established || 'N/A'}
                </p>
                <p className="text-[#122537]">
                  <strong>Surface:</strong> {venue.surface || 'Grass (Standard)'}
                </p>
                <p className="text-[#122537]">
                  <strong>Address:</strong> {venue.address || 'Not Available'}
                </p>
              </div>
              <p className="text-[#122537] mb-4">
                <strong>Description:</strong> {venue.description || 'A renowned cricket venue known for its vibrant atmosphere and historic matches.'}
              </p>
              <Link
                to="/stadiums"
                className="inline-flex items-center mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Stadiums
              </Link>
            </div>

            {/* Map Section */}
            {venue.lat && venue.lng && (
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <h3 className="text-xl font-semibold text-[#122537] mb-4">Location Map</h3>
                <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d${venue.lng}!3d${venue.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${venue.lat}_${venue.lng}!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus`}
                  ></iframe>
                </div>
              </div>
            )}

            {/* Matches Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-[#122537] mb-4">Matches at {venue.name}</h3>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('live')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'live' ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
                  >
                    Live
                  </button>
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'upcoming' ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab === 'recent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
                  >
                    Recent
                  </button>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search matches by team or league..."
                  className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-4">
                {currentMatches.length > 0 ? (
                  currentMatches.map((match) => (
                    <MatchCard key={match.id} match={match} activeFilter={activeTab} />
                  ))
                ) : (
                  <p className="text-[#122537]">No {activeTab} matches available at this stadium.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
