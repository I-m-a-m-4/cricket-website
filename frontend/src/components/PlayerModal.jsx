// src/components/PlayerModal.jsx
import React from "react";

const PlayerModal = ({ player, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="relative">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{player.full_name || player.name}</h2>
          {player.nickname && <p className="text-lg text-red-600">"{player.nickname}"</p>}
          <p className="text-gray-600">{player.role} • {player.team}</p>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div><strong>Country:</strong> {player.country}</div>
            <div><strong>DOB:</strong> {player.date_of_birth}</div>
            <div><strong>Birth Place:</strong> {player.birth_place || 'Unknown'}</div>
            <div><strong>Height:</strong> {player.height ? `${player.height} cm` : 'N/A'}</div>
            <div><strong>Weight:</strong> {player.weight ? `${player.weight} kg` : 'N/A'}</div>
            <div><strong>Debut:</strong> {player.debut || 'N/A'}</div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Batting & Bowling</h3>
            <p className="text-gray-700 text-sm">{player.batting_style} • {player.bowling_style}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-800">Career Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Matches: <strong>{player.stats.matches}</strong></div>
              <div>Runs: <strong>{player.stats.runs}</strong></div>
              <div>Wickets: <strong>{player.stats.wickets}</strong></div>
              <div>Avg: <strong>{player.stats.avg}</strong></div>
              <div>SR: <strong>{player.stats.sr}</strong></div>
              <div>Econ: <strong>{player.stats.econ}</strong></div>
            </div>
          </div>

          <p className="mt-4 text-gray-700 text-sm leading-relaxed">{player.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;