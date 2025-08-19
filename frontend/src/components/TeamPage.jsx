import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PlayerModal from '../components/PlayerModal.jsx';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

export const fetchTeamDetails = async (id) => {
  if (!id || isNaN(id)) throw new Error('Invalid team ID');
  try {
    const response = await axios.get(`${BASE_URL}/teams/${id}`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPlayerDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${id}`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const TeamPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchTeamDetails(id);
        setData(res);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl w-3/4 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-gray-50 min-h-screen">
        <div className="text-red-600 text-lg">Team not found</div>
        <Link to="/teams-players" className="mt-4 inline-block text-[#122e47] font-medium hover:text-blue-800">
          ← Back to Teams
        </Link>
      </div>
    );
  }

  const { team, players = [], officials = [], recentMatches = [], upcoming = [] } = data;

  return (
    <div className="team-page bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white shadow border-b">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center">
          <img
            src={team.image || ''}
            alt={team.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
          />
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{team.name || 'Unknown Team'}</h1>
            <p className="text-lg text-gray-600">{team.country || 'Unknown'} • Founded: {team.founded || 'N/A'}</p>
            <p className="text-sm text-gray-500">Home: {team.venue.name || 'Unknown'}, {team.venue.city || 'Unknown'}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-[#122e47]">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <Link to="/teams-players" className="hover:text-[#122e47]">Teams & Players</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-900">{team.name}</span>
            </li>
          </ol>
        </nav>

        {/* About */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About {team.name || 'Team'}</h2>
          <p className="text-gray-700 leading-relaxed">
            {team.description || `The ${team.name || 'team'} are a professional cricket team based in ${team.venue.city || 'Unknown'}.`}
          </p>
        </section>

        {/* Venue */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Home Venue</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={team.venue.image_path || ''}
              alt={`${team.venue.name || 'Stadium'} image`}
              className="w-full md:w-1/3 h-64 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-800">{team.venue.name || 'Unknown Venue'}</h3>
              <p className="text-gray-600">Location: {team.venue.city || 'Unknown City'}</p>
              <p className="text-gray-600">Capacity: {team.venue.capacity || 'N/A'}</p>
              <p className="text-gray-600">Description: {team.venue.description || 'No description available.'}</p>
            </div>
          </div>
        </section>

        {/* Squad */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Squad ({players.length} Players)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {players.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedPlayer(p)}
              >
                <img
                  src={p.image || ''}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.role} • {p.country}</p>
                  <p className="text-xs text-gray-500 truncate">{p.batting_style}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Officials */}
        {officials.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff & Officials</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {officials.map((s) => (
                <div key={s.id} className="text-center">
                  <img
                    src={s.image || ''}
                    alt={s.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <h4 className="font-medium text-gray-900 mt-2">{s.name}</h4>
                  <p className="text-sm text-gray-600">{s.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Matches */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Matches</h2>
          <div className="space-y-3">
            {recentMatches.length > 0 ? (
              recentMatches.map((m) => (
                <div key={m.id} className="flex justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{m.vs}</span>
                    <span className="text-sm text-gray-500 ml-2">{m.league}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${m.result === 'Won' ? 'text-green-600' : m.result === 'Lost' ? 'text-red-600' : ''}`}>
                      {m.result}
                    </div>
                    <div className="text-sm text-gray-500">{m.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No recent matches available.</p>
            )}
          </div>
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Fixtures</h2>
            <div className="space-y-3">
              {upcoming.map((u) => (
                <div key={u.id} className="flex justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{u.vs}</span>
                    <div className="text-sm text-gray-500">{u.league} • {u.venue}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{u.date}</div>
                    <div className="text-sm text-gray-500">{u.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};

export default TeamPage;