import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/teams?fields[teams]=id,name,image_path,country_id`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/countries`, { timeout: 10000 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, countriesData] = await Promise.all([fetchTeams(), fetchCountries()]);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setCountries(Array.isArray(countriesData) ? countriesData : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getCountryName = (id) => {
    const country = countries.find(c => c.id === id);
    return country ? country.name : '';
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic team categorization
  const groupedTeams = {
    'Popular Men\'s International Teams': filteredTeams.filter(team => 
      ['India', 'Australia', 'England', 'South Africa', 'Pakistan', 'New Zealand'].includes(getCountryName(team.country_id))
    ),
    'BBL Teams': filteredTeams.filter(team => 
      ['Adelaide Strikers', 'Brisbane Heat', 'Sydney Sixers', 'Melbourne Stars'].some(name => team.name.includes(name))
    ),
    'Other Teams': filteredTeams.filter(team => 
      !['India', 'Australia', 'England', 'South Africa', 'Pakistan', 'New Zealand'].includes(getCountryName(team.country_id)) &&
      !['Adelaide Strikers', 'Brisbane Heat', 'Sydney Sixers', 'Melbourne Stars'].some(name => team.name.includes(name))
    ),
  };

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
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="hover:text-[#122e47]">Home</Link>
              <span className="mx-2">></span>
            </li>
            <li className="flex items-center">
              <span className="font-bold text-gray-900">Teams & Players</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">Teams & Players</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teams..."
          className="w-full sm:w-1/2 lg:w-1/3 mb-6 p-2 border rounded"
        />
        <div className="overflow-x-auto">
          {Object.entries(groupedTeams).map(([category, teamsList]) => (
            teamsList.length > 0 && (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category}</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 border-b">Team</th>
                        <th className="p-3 border-b">Country</th>
                        <th className="p-3 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamsList.map((team) => (
                        <tr key={team.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">
                            <div className="flex items-center">
                              <img
                                src={team.image_path || ''}
                                alt={team.name}
                                className="w-12 h-12 object-cover mr-3"
                              />
                              <span>{team.name}</span>
                            </div>
                          </td>
                          <td className="p-3 border-b">{getCountryName(team.country_id)}</td>
                          <td className="p-3 border-b">
                            <Link
                              to={`/team/${team.id}`}
                              className="text-blue-600 hover:underline"
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
            )
          ))}
        </div>
        {/* Sidebar with News */}
        <aside className="w-full md:w-1/4 mt-8 md:mt-0 md:ml-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Cricket News</h3>
          <ul className="space-y-4">
            <li><a href="#" className="text-blue-600 hover:underline">India Wins Test Series Against England</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">BBL 2025 Schedule Announced</a></li>
            <li><a href="#" className="text-blue-600 hover:underline">New Zealand Captain Injured</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}