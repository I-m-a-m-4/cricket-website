import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesPage = () => {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/seasons/${id}`, {
          params: { include: 'stages,fixtures,runs,standings' },
        });
        setSeries(response.data.data);
      } catch (err) {
        setError('Failed to load series data. Please try again later.');
        console.error('Error fetching series:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-gray-200 h-80 rounded-xl mb-8"></div>
          <div className="flex space-x-4 mb-8">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <div key={tab} className="h-12 bg-gray-200 w-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600 text-xl font-semibold">{error || 'Series not found'}</p>
          <Link
            to="/series"
            className="mt-6 inline-block text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            ← Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const { name, league, stages = [] } = series;
  const currentStage = stages.find((stage) => stage.id === parseInt(id)) || stages[0] || {};
  const fixtures = currentStage?.fixtures?.data || [];
  const standings = currentStage?.standings?.data || [];
  const news = [
    {
      id: 1,
      title: 'Series Update',
      description: 'Latest news about the series...',
      image: 'https://via.placeholder.com/400x200?text=Series+News',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-400 text-white rounded-xl overflow-hidden mb-12 h-80 flex items-center shadow-lg">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 p-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{name || 'Series Name'}</h1>
            <p className="text-lg sm:text-xl mt-2">
              {league?.name || 'League'} • {currentStage?.name || 'Current Stage'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 border-b border-gray-200">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-lg transition-colors ${
                  activeTab === tab
                    ? 'border-b-4 border-red-600 text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fixtures.map((fixture) => (
              <Link key={fixture.id} to={`/match/${fixture.id}`} className="block">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {fixture.localteam?.name || 'Team A'} vs {fixture.visitorteam?.name || 'Team B'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{fixture.league?.name || 'League'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(fixture.starting_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    • {fixture.status || 'Upcoming'}
                  </p>
                  <div className="mt-3">
                    {fixture.runs?.map((run) => (
                      <p key={run.id} className="text-sm text-gray-600">
                        {run.team_id === fixture.localteam_id
                          ? fixture.localteam?.name
                          : fixture.visitorteam?.name}
                        : {run.score}/{run.wickets} ({run.overs} overs)
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
            {fixtures.length === 0 && (
              <p className="text-gray-600 text-center col-span-full">No matches available.</p>
            )}
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Standings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Rank</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Team</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Points</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{team.name || 'Unknown Team'}</td>
                      <td className="py-3 px-4">{team.points || 0}</td>
                      <td className="py-3 px-4">{team.matches || 0}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-gray-600">
                        No standings available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'points' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Points Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-800 font-semibold">Rank</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Team</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Played</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Won</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Lost</th>
                    <th className="py-3 px-4 text-gray-800 font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{team.name || 'Unknown Team'}</td>
                      <td className="py-3 px-4">{team.matches || 0}</td>
                      <td className="py-3 px-4">{team.wins || 0}</td>
                      <td className="py-3 px-4">{team.losses || 0}</td>
                      <td className="py-3 px-4">{team.points || 0}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-gray-600">
                      No points table data available.
                    </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <Link key={article.id} to={`/news/${article.id}`} className="block">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">{article.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            {news.length === 0 && (
              <p className="text-gray-600 text-center col-span-full">No news available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;