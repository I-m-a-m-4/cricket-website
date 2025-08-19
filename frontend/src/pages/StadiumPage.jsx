import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MatchCardSkeleton from '../components/MatchCardSkeleton';
import { useTheme } from '../context/ThemeContext';

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

// Custom MatchCard Component
function MatchCard({ match, activeFilter }) {
  const getMatchType = () => {
    switch (activeFilter) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      default:
        return match.status === 'Live' ? 'LIVE' : 'UPCOMING';
    }
  };

  const matchType = getMatchType();

  const getStatusColor = (type) => {
    switch (type) {
      case 'LIVE':
        return 'text-red-500 bg-red-50';
      case 'UPCOMING':
        return 'text-blue-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const team1Code = match.localteam?.code || 'T1';
  const team2Code = match.visitorteam?.code || 'T2';
  const team1Name = match.localteam?.name || 'Team A';
  const team2Name = match.visitorteam?.name || 'Team B';
  const team1Flag = match.localteam?.image_path || `https://via.placeholder.com/40.png?text=${team1Code}`;
  const team2Flag = match.visitorteam?.image_path || `https://via.placeholder.com/40.png?text=${team2Code}`;
  const team1Score = match.runs?.find((run) => run.team_id === match.localteam_id)?.score || '';
  const team2Score = match.runs?.find((run) => run.team_id === match.visitorteam_id)?.score || '';
  const matchDate = match.starting_at
    ? new Date(match.starting_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';
  const matchTime = match.starting_at
    ? new Date(match.starting_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  return (
    <Link to={`/match/${match.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-3 w-full h-32 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(matchType)}`}>
            {matchType}
          </span>
          <span className="text-xs text-[#122537] truncate">{match.league?.name || 'Cricket Match'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={team1Flag} alt={team1Name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-sm font-medium text-[#122537] truncate">{team1Name}</span>
          </div>
          <span className="text-xs font-mono text-[#122537]">{team1Score || 'TBD'}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={team2Flag} alt={team2Name} className="w-5 h-5 rounded-full object-cover" />
            <span className="text-sm font-medium text-[#122537] truncate">{team2Name}</span>
          </div>
          <span className="text-xs font-mono text-[#122537]">{team2Score || (matchType === 'UPCOMING' ? 'TBD' : '')}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-[#122537]">
          <span>{match.venue?.name || 'TBD'}</span>
          {matchType === 'UPCOMING' && (
            <span>
              {matchDate} <span className="font-bold">{matchTime}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function StadiumPage() {
  const { isDarkMode } = useTheme();
  const [matches, setMatches] = useState([]);
  const [venues, setVenues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [trendingVenues, setTrendingVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDot, setActiveDot] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [hasFloodlight, setHasFloodlight] = useState(null);
  const matchCarouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let liveMatchesData = [];
        let upcomingMatchesData = [];
        let venuesData = [];
        let countriesData = [];

        try {
          const liveResponse = await fetchWithRetry(`${BASE_URL}/matches/live`, {});
          liveMatchesData = Array.isArray(liveResponse.data) ? liveResponse.data : [];
        } catch (err) {
          console.warn('Failed to fetch live matches:', err.message);
        }

        try {
          const upcomingResponse = await fetchWithRetry(`${BASE_URL}/matches/upcoming`, {});
          upcomingMatchesData = Array.isArray(upcomingResponse.data) ? upcomingResponse.data : [];
        } catch (err) {
          console.warn('Failed to fetch upcoming matches:', err.message);
        }

        try {
          const venuesResponse = await fetchWithRetry(`${BASE_URL}/venues?include=country`, {});
          venuesData = Array.isArray(venuesResponse.data) ? venuesResponse.data : [];
        } catch (err) {
          console.warn('Failed to fetch venues:', err.message);
        }

        try {
          const countriesResponse = await fetchWithRetry(`${BASE_URL}/countries`, {});
          countriesData = Array.isArray(countriesResponse.data) ? countriesResponse.data : [];
        } catch (err) {
          console.warn('Failed to fetch countries:', err.message);
        }

        setMatches([...liveMatchesData, ...upcomingMatchesData]);
        setVenues(venuesData);
        setTrendingVenues(venuesData.slice(0, 5));
        setCountries(countriesData);
        setLoading(false);

        if (liveMatchesData.length === 0 && upcomingMatchesData.length === 0 && venuesData.length === 0) {
          setError('No data available. Please try again later.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(`Failed to load data: ${err.message || 'Please try again.'}`);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = () => {
    if (matchCarouselRef.current) {
      const scrollLeft = matchCarouselRef.current.scrollLeft;
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center')?.offsetWidth || 250;
      const newActiveDot = Math.floor(scrollLeft / cardWidth);
      setActiveDot(newActiveDot);
    }
  };

  const scrollToCard = (dotIndex) => {
    if (matchCarouselRef.current) {
      const cardWidth = matchCarouselRef.current.querySelector('.snap-center')?.offsetWidth || 250;
      // Adjust scroll position based on screen size
      const cardsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const scrollPosition = dotIndex * cardWidth * cardsPerView;
      matchCarouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(search.toLowerCase()) ||
                         venue.city?.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = !selectedCountry || venue.country_id === parseInt(selectedCountry);
    const matchesFloodlight = hasFloodlight === null || venue.floodlight === hasFloodlight;
    return matchesSearch && matchesCountry && matchesFloodlight;
  });

  const totalDots = Math.ceil(matches.length / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1)) || 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6 overflow-x-hidden pb-4">
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
                  <MatchCardSkeleton />
                </div>
              ))}
            </div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Link to="/" className="mt-4 inline-block text-[#122537] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <meta name="description" content="Explore cricket stadiums with details on capacity, location, and more." />
      <meta name="keywords" content="cricket stadiums, venue details, cricket grounds" />
      <meta name="robots" content="index, follow" />
      <title>Cricket Stadiums</title>
      <div className="container mx-auto px-6 py-8">
        <nav className="text-base text-[#122537] mb-6 font-medium" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex items-center space-x-2">
            <li className="flex items-center">
              <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
              <span className="mx-2 text-[#122537]">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-[#122537]">Cricket Stadiums</span>
            </li>
          </ol>
        </nav>
        {/* Matches Carousel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#122537] mb-4">Live & Upcoming Matches</h2>
          <div
            ref={matchCarouselRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {matches.length > 0 ? (
              matches.map((match) => (
                <div key={match.id} className="snap-center flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
                  <MatchCard match={match} activeFilter={match.status === 'Live' ? 'live' : 'upcoming'} />
                </div>
              ))
            ) : (
              <p className="text-[#122537] w-full text-center">No live or upcoming matches available.</p>
            )}
          </div>
          {matches.length > 0 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalDots }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors duration-200 ${
                    activeDot === index ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                  onClick={() => scrollToCard(index)}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stadiums by name or city..."
            className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full sm:w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setHasFloodlight(true)}
              className={`px-4 py-2 rounded-lg ${hasFloodlight === true ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
            >
              Floodlit
            </button>
            <button
              onClick={() => setHasFloodlight(false)}
              className={`px-4 py-2 rounded-lg ${hasFloodlight === false ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
            >
              Non-Floodlit
            </button>
            <button
              onClick={() => setHasFloodlight(null)}
              className={`px-4 py-2 rounded-lg ${hasFloodlight === null ? 'bg-red-500 text-white' : 'bg-gray-200 text-[#122537] hover:bg-gray-300'}`}
            >
              All
            </button>
          </div>
        </div>

        {/* Main Content with Grid and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Stadiums Grid */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#122537] mb-6">Cricket Stadiums</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/stadium/${venue.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md p-4 w-full font-open-sans break-words hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={venue.image_path || '/stadium.jpg'}
                      alt={venue.name}
                      className="w-full h-32 object-cover rounded-t-lg mb-2"
                    />
                    <h3 className="text-lg font-bold text-[#122537] mb-1">{venue.name}</h3>
                    <p className="text-sm text-[#122537] mb-1">{venue.city || 'Unknown City'}, {venue.country?.name || 'N/A'}</p>
                    <p className="text-sm text-[#122537] mb-1">Capacity: {venue.capacity || 'N/A'}</p>
                    <p className="text-sm text-[#122537] mb-1">Established: {venue.established || 'N/A'}</p>
                    <div className="mt-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        venue.floodlight ? 'text-green-500 bg-green-50' : 'text-gray-500 bg-gray-100'
                      }`}>
                        {venue.floodlight ? 'Floodlit' : 'Non-Floodlit'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {filteredVenues.length === 0 && (
              <p className="text-[#122537] text-center mt-4">No stadiums found matching your criteria.</p>
            )}
          </div>

          {/* Trending Stadiums Sidebar */}
          <div className="lg:w-80">
            <h2 className="text-xl font-bold text-[#122537] mb-4">Trending Stadiums</h2>
            <div className="space-y-4">
              {trendingVenues.map((venue) => (
                <Link
                  key={venue.id}
                  to={`/stadium/${venue.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md p-4 w-full font-open-sans break-words hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={venue.image_path || '/stadium.jpg'}
                      alt={venue.name}
                      className="w-full h-24 object-cover rounded-t-lg mb-2"
                    />
                    <h3 className="text-base font-bold text-[#122537] mb-1">{venue.name}</h3>
                    <p className="text-xs text-[#122537]">{venue.city || 'Unknown City'}</p>
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
