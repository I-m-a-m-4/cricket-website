import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function TeamRankings() {
  const { isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState('Team');
  const [searchTerm, setSearchTerm] = useState('');
  const [teams] = useState([
    'Afghanistan',
    'Australia', 
    'Bangladesh',
    'England',
    'ICC World XI',
    'India',
    'Ireland',
    'New Zealand',
    'Pakistan',
    'South Africa',
    'Sri Lanka',
    'West Indies',
    'Zimbabwe'
  ]);

  const formatSections = [
    {
      title: 'Test matches',
      icon: '🏏',
      records: [
        'Team records',
        'Batting records',
        'Bowling records',
        'Wicketkeeping records',
        'Fielding records',
        'All-round records',
        'Partnership records',
        'Individual records (captains, players, umpires)'
      ]
    },
    {
      title: 'One-Day Internationals',
      icon: '🏏',
      records: [
        'Team records',
        'Batting records',
        'Bowling records',
        'Wicketkeeping records',
        'Fielding records',
        'All-round records',
        'Partnership records',
        'Individual records (captains, players, umpires)'
      ]
    },
    {
      title: 'T20I',
      icon: '🏏',
      records: [
        'Team records',
        'Batting records',
        'Bowling records',
        'Wicketkeeping records',
        'Fielding records',
        'All-round records',
        'Partnership records',
        'Individual records (captains, players, umpires)'
      ]
    }
  ];

  const otherFormats = [
    'First-class matches',
    'List A matches',
    'Twenty20 matches',
    "Women's Test matches",
    "Women's One-Day Internationals",
    "Women's Twenty20 Internationals",
    'Combined Test, ODI and T20I records',
    'Combined First-class, List A and Twenty20',
    'All cricket records (including minor cricket)',
    "Under-19s Youth Test matches",
    "Under-19s Youth One-Day Internationals"
  ];

  const filteredTeams = teams.filter(team => 
    team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Home</span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-400'}>›</span>
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Records</span>
          </div>
        </nav>

        {/* Main Heading */}
        <h1 className="text-3xl font-bold mb-8">Cricket Records</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Format Sections */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {formatSections.map((section, index) => (
                <div 
                  key={index}
                  className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                    border rounded-lg p-6`}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-lg mr-2">{section.icon}</span>
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.records.map((record, recordIndex) => (
                      <li 
                        key={recordIndex}
                        className={`text-sm cursor-pointer transition-colors duration-200
                          ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                      >
                        {record}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Other Formats */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
              border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                <span className="text-lg mr-2">🏏</span>
                <h2 className="text-lg font-semibold">Other Formats</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {otherFormats.map((format, index) => (
                  <div 
                    key={index}
                    className={`text-sm cursor-pointer transition-colors duration-200 py-1
                      ${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    {format}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Records by Team Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
              border rounded-lg p-6 sticky top-6`}>
              <div className="flex items-center mb-4">
                <span className="text-lg mr-2">📋</span>
                <h2 className="text-lg font-semibold">Records by Team</h2>
              </div>

              {/* Tabs */}
              <div className="flex mb-4 border-b border-gray-300">
                <button
                  onClick={() => setSelectedTab('Team')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                    ${selectedTab === 'Team' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent hover:border-gray-300'}`}
                >
                  Team
                </button>
                <button
                  onClick={() => setSelectedTab('Host country')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                    ${selectedTab === 'Host country' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent hover:border-gray-300'}`}
                >
                  Host country
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search for an international team"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              {/* Team List */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {filteredTeams.map((team, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 text-sm cursor-pointer rounded transition-colors duration-200
                      ${isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {team}
                  </div>
                ))}
              </div>

              {filteredTeams.length === 0 && (
                <div className={`text-sm text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No teams found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamRankings;