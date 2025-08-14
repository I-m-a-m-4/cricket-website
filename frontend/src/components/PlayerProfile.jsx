import React from 'react';

function PlayerProfile({ player }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-bold font-cab text-dark-bg">{player.name}</h3>
      <p className="text-gray-600">Role: {player.role}</p>
      <p className="text-gray-600">Matches: {player.matches}</p>
    </div>
  );
}

export default PlayerProfile;