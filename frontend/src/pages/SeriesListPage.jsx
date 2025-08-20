import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesListPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('current');

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/seasons`);
        const seasonsData = response.data.data || [];
        setSeasons(seasonsData);
        setFilteredSeasons(seasonsData);
      } catch (err) {
        setError('Failed to load seasons');
        console.error('Error fetching seasons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    // Filter seasons based on active filter
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let filtered = [];
    
    switch (activeFilter) {
      case 'current':
        // Show current year seasons or ongoing ones
        filtered = seasons.filter(season => 
          season.year >= currentYear || 
          season.name?.toLowerCase().includes('2025') ||
          season.name?.toLowerCase().includes('current')
        );
        break;
      case 'future':
        // Show future seasons
        filtered = seasons.filter(season => 
          season.year > currentYear ||
          season.name?.toLowerCase().includes('future')
        );
        break;
      case 'concluded':
        // Show past seasons
        filtered = seasons.filter(season => 
          season.year < currentYear ||
          season.name?.toLowerCase().includes('concluded')
        );
        break;
      default:
        filtered = seasons;
    }
    
    setFilteredSeasons(filtered);
  }, [seasons, activeFilter]);

  const categorizeSeasons = (seasons) => {
    const categories = {
      internationalTours: [],
      internationalTournaments: [],
      t20Tournaments: [],
      associateCricket: []
    };

    seasons.forEach(season => {
      const name = season.name?.toLowerCase() || '';
      const league = season.league?.name?.toLowerCase() || '';
      
      if (name.includes('vs') || name.includes('tour') || league.includes('tour')) {
        categories.internationalTours.push(season);
      } else if (name.includes('t20') || name.includes('hundred') || name.includes('cpl')) {
        categories.t20Tournaments.push(season);
      } else if (name.includes('associate') || name.includes('nordic') || name.includes('romania')) {
        categories.associateCricket.push(season);
      } else {
        categories.internationalTournaments.push(season);
      }
    });

    return categories;
  };

  const getCountryFlags = (seasonName) => {
    // Mock flag logic - you can improve this based on actual team names
    const flags = [];
    if (seasonName.includes('AUS') || seasonName.includes('Australia')) {
      flags.push('🇦🇺');
    }
    if (seasonName.includes('IND') || seasonName.includes('India')) {
      flags.push('🇮🇳');
    }
    if (seasonName.includes('SA') || seasonName.includes('South Africa')) {
      flags.push('🇿🇦');
    }
    if (seasonName.includes('NZ') || seasonName.includes('New Zealand')) {
      flags.push('🇳🇿');
    }
    if (seasonName.includes('UAE')) {
      flags.push('🇦🇪');
    }
    if (seasonName.includes('Bangladesh')) {
      flags.push('🇧🇩');
    }
    if (seasonName.includes('Netherlands')) {
      flags.push('🇳🇱');
    }
    if (seasonName.includes('West Indies')) {
      flags.push('🏴');
    }
    if (seasonName.includes('Sri Lanka')) {
      flags.push('🇱🇰');
    }
    
    // Default flags if none found
    if (flags.length === 0) {
      flags.push('🏏', '🏆');
    }
    
    return flags.slice(0, 2); // Max 2 flags
  };

  const getSeasonIcon = (seasonName, leagueName) => {
    const name = (seasonName + ' ' + leagueName).toLowerCase();
    
    if (name.includes('hundred')) {
      return <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">H</div>;
    }
    if (name.includes('cpl')) {
      return <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>;
    }
    if (name.includes('asia cup')) {
      return <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">🏆</div>;
    }
    if (name.includes('nordic')) {
      return <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>;
    }
    
    return <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">🏏</div>;
  };

  const formatDateRange = (season) => {
    // Mock date ranges - you can improve this based on actual season dates
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 30);
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb skeleton */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="h-4 bg-gray-200 w-48 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Header skeleton */}
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 bg-gray-200 w-96 rounded mb-8 animate-pulse"></div>
          
          {/* Filter section skeleton */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 w-20 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array(4).fill().map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="flex-1">
              <div className="space-y-4">
                {Array(8).fill().map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 w-64 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 w-32 rounded animate-pulse"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 w-24 rounded animate-pulse"></div>
                        <div className="h-8 bg-gray-200 w-16 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const categories = categorizeSeasons(filteredSeasons);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Series</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Cricket Fixtures - Domestic & International Cricket Series
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveFilter('current')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'current' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Current Cricket
                  </button>
                  <button
                    onClick={() => setActiveFilter('future')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'future' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Future Series / Tournaments
                  </button>
                  <button
                    onClick={() => setActiveFilter('concluded')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'concluded' 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Recently Concluded
                  </button>
                </div>

                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-3">DOWNLOAD SCHEDULE</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="cursor-pointer hover:text-blue-600">
                      Download ICC's Future tours programme (Men)
                    </div>
                    <div className="cursor-pointer hover:text-blue-600">
                      Download ICC's Future tours programme (Women)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* International Tours Section */}
            {categories.internationalTours.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">International Tours</h2>
                <div className="space-y-3">
                  {categories.internationalTours.map((season) => {
                    const flags = getCountryFlags(season.name);
                    return (
                      <Link
                        key={season.id}
                        to={`/series/${season.id}`}
                        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Country flags */}
                              <div className="flex gap-1">
                                {flags.map((flag, idx) => (
                                  <div key={idx} className="w-6 h-4 flex items-center justify-center text-sm">
                                    {flag}
                                  </div>
                                ))}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {season.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatDateRange(season)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                                Fixtures & Results
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                                Squads
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* International Tournaments Section */}
            {categories.internationalTournaments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">International Tournaments</h2>
                <div className="space-y-3">
                  {categories.internationalTournaments.map((season) => (
                    <Link
                      key={season.id}
                      to={`/series/${season.id}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getSeasonIcon(season.name, season.league?.name)}
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {season.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatDateRange(season)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Fixtures & Results
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Squads
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Points Table
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* T20/T10 Tournaments Section */}
            {categories.t20Tournaments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">T20/T10 Tournaments</h2>
                <div className="space-y-3">
                  {categories.t20Tournaments.map((season) => (
                    <Link
                      key={season.id}
                      to={`/series/${season.id}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getSeasonIcon(season.name, season.league?.name)}
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {season.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatDateRange(season)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Fixtures & Results
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Squads
                            </button>
                            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                              Points Table
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Associate Cricket Section */}
            {categories.associateCricket.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Associate Cricket</h2>
                <div className="space-y-3">
                  {categories.associateCricket.map((season) => {
                    const flags = getCountryFlags(season.name);
                    return (
                      <Link
                        key={season.id}
                        to={`/series/${season.id}`}
                        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                {flags.map((flag, idx) => (
                                  <div key={idx} className="w-6 h-4 flex items-center justify-center text-sm">
                                    {flag}
                                  </div>
                                ))}
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {season.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {formatDateRange(season)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                                Fixtures & Results
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                                Points Table
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No data message */}
            {filteredSeasons.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No cricket series found for the selected filter.</p>
                <button 
                  onClick={() => setActiveFilter('current')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Current Cricket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesListPage;