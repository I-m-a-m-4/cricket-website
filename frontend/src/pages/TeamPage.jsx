import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/teams`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchVenues = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/venues`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, venuesData] = await Promise.all([fetchTeams(), fetchVenues()]);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setVenues(Array.isArray(venuesData) ? venuesData : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Teams & Players</h1>
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || filteredTeams.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Teams & Players</h1>
          <p className="text-red-600 text-lg">{error || 'No teams found'}</p>
          <Link to="/" className="mt-4 inline-block text-[#122e47] font-medium hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
          Teams & Players
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teams..."
          className="w-full sm:w-1/2 lg:w-1/3 mb-6 p-2 border rounded"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 border-b">Team</th>
                    <th className="p-4 border-b">Country</th>
                    <th className="p-4 border-b">Founded</th>
                    <th className="p-4 border-b">Venue</th>
                    <th className="p-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b font-bold">{team.name}</td>
                      <td className="p-4 border-b">{team.country || 'N/A'}</td>
                      <td className="p-4 border-b">N/A</td>
                      <td className="p-4 border-b">{team.venue?.name || 'N/A'}</td>
                      <td className="p-4 border-b">
                        <Link
                          to={`/team/${team.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stadiums Sidebar */}
          <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stadiums</h2>
            <ul className="space-y-4">
              {venues.map((venue, index) => (
                <li key={index} className="flex flex-col items-center">
                  <img
                    src={venue.image_path || '/icc.jpg'}
                    alt={venue.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                    onError={(e) => { e.target.src = '/icc.jpg'; }}
                  />
                  <span className="text-gray-600">{venue.name}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
