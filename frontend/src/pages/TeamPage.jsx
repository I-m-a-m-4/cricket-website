// src/pages/TeamsPage.jsx
import { Link } from 'react-router-dom';

const teams = [
  { id: 1, code: 'IND', name: 'India', flag: 'https://flagcdn.com/w40/in.png' },
  { id: 2, code: 'AUS', name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
  { id: 3, code: 'ENG', name: 'England', flag: 'https://flagcdn.com/w40/gb-eng.png' },
  { id: 4, code: 'NZ', name: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
  { id: 5, code: 'SA', name: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' },
  { id: 6, code: 'PAK', name: 'Pakistan', flag: 'https://flagcdn.com/w40/pk.png' },
  { id: 7, code: 'WI', name: 'West Indies', flag: 'https://flagcdn.com/w40/wi.png' },
  { id: 8, code: 'BAN', name: 'Bangladesh', flag: 'https://flagcdn.com/w40/bd.png' },
  { id: 9, code: 'SL', name: 'Sri Lanka', flag: 'https://flagcdn.com/w40/lk.png' },
  { id: 10, code: 'AFG', name: 'Afghanistan', flag: 'https://flagcdn.com/w40/af.png' },
];

export default function TeamsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
          Teams & Players
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <Link
              to={`/team/${team.id}`}
              key={team.id}
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              <img
                src={team.flag}
                alt={`${team.name} flag`}
                className="w-12 h-9 mx-auto mb-3 object-contain rounded border border-gray-200"
                loading="lazy"
              />
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600">
                {team.name}
              </h2>
              <p className="text-sm text-gray-500">View Squad & Stats</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}