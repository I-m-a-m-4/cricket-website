import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeamRankings from './TeamRankings';
import PlayerCareerStats from './PlayerCareerStats';
import { useTheme } from '../context/ThemeContext';

function Stats() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="team-rankings" element={<TeamRankings />} />
          <Route path="player-career-stats" element={<PlayerCareerStats />} />
          <Route path="/" element={<TeamRankings />} />
        </Routes>
      </div>
    </div>
  );
}

export default Stats;