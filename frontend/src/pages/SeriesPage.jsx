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
        setError('Failed to load series data');
        console.error('Error fetching series:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse bg-gray-200 h-64 rounded-lg mb-6"></div>
          <div className="flex space-x-4 mb-6">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <div key={tab} className="h-10 bg-gray-200 w-24 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500 text-lg">{error || 'Series not found'}</p>
          <Link to="/series" className="mt-4 inline-block text-red-500 hover:underline">
            ← Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const { name, league, stages = [] } = series;
  const currentStage = stages.find(stage => stage.id === parseInt(id)) || stages[0];
  const fixtures = currentStage?.fixtures?.data || [];
  const standings = currentStage?.standings?.data || [];
  const news = [
    { id: 1, title: 'Series Update', description: 'Latest news about the series...', image: '/icc.jpg' },
    // Mock news; replace with real data from /api/news if integrated
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative bg-red-500 text-white rounded-lg overflow-hidden mb-8 h-64 flex items-center">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 p-6">
            <h1 className="text-4xl font-extrabold">{name || 'Series Name'}</h1>
            <p className="text-lg">{league?.name || 'League'} • {currentStage?.name || 'Current Stage'}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium ${activeTab === tab ? 'border-b-2 border-red-500 text-red-500' : 'text-[#122e47] hover:text-red-500'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fixtures.map((fixture) => (
              <Link key={fixture.id} to={`/match/${fixture.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-[#122e47]">
                    {fixture.localteam?.name} vs {fixture.visitorteam?.name}
                  </h3>
                  <p className="text-sm text-gray-600">{fixture.league?.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(fixture.starting_at).toLocaleDateString()} • {fixture.status}
                  </p>
                  <div className="mt-2">
                    {fixture.runs?.map((run) => (
                      <p key={run.id} className="text-sm">
                        {run.team_id === fixture.localteam_id ? fixture.localteam?.name : fixture.visitorteam?.name}: {run.score}/{run.wickets} ({run.overs} overs)
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
            {fixtures.length === 0 && <p className="text-[#122e47] text-center">No matches available.</p>}
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-semibold text-[#122e47] mb-4">Standings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-[#122e47]">Rank</th>
                    <th className="py-2 px-4 text-[#122e47]">Team</th>
                    <th className="py-2 px-4 text-[#122e47]">Points</th>
                    <th className="py-2 px-4 text-[#122e47]">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{team.name}</td>
                      <td className="py-2 px-4">{team.points || 0}</td>
                      <td className="py-2 px-4">{team.matches || 0}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-[#122e47]">
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
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-2xl font-semibold text-[#122e47] mb-4">Points Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-[#122e47]">Rank</th>
                    <th className="py-2 px-4 text-[#122e47]">Team</th>
                    <th className="py-2 px-4 text-[#122e47]">Played</th>
                    <th className="py-2 px-4 text-[#122e47]">Won</th>
                    <th className="py-2 px-4 text-[#122e47]">Lost</th>
                    <th className="py-2 px-4 text-[#122e47]">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{team.name}</td>
                      <td className="py-2 px-4">{team.matches || 0}</td>
                      <td className="py-2 px-4">{team.wins || 0}</td>
                      <td className="py-2 px-4">{team.losses || 0}</td>
                      <td className="py-2 px-4">{team.points || 0}</td>
                    </tr>
                  ))}
                  {standings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-[#122e47]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <Link key={article.id} to={`/news/${article.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#122e47]">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{article.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            {news.length === 0 && <p className="text-[#122e47] text-center">No news available.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;