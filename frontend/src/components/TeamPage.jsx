// src/pages/TeamPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerModal from "../components/PlayerModal.jsx";

export const fetchTeamDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team details:", error);
    throw error;
  }
};

export const fetchPlayerDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${id}/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player details:", error);
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading team data...</div>;
  if (!data) return <div className="p-8 text-red-600">Team not found.</div>;

  const { team, players, officials, recentMatches, upcoming } = data;

  return (
    <div className="team-page bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-white shadow border-b">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center">
          <img
            src={team.image}
            alt={team.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            onError={(e) => e.target.src = `https://avatar.vercel.sh/${team.name}.png?text=${team.code}`}
          />
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{team.name}</h1>
            <p className="text-lg text-gray-600">{team.country} • Founded: {team.founded}</p>
            <p className="text-sm text-gray-500">Home: {team.venue}, {team.city}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* About */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About {team.name}</h2>
          <p className="text-gray-700 leading-relaxed">{team.description}</p>
        </section>

        {/* Squad */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Squad ({players.length} Players)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {players.map(p => (
              <div
                key={p.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedPlayer(p)}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => e.target.src = `https://avatar.vercel.sh/${p.name}.png?text=${p.name[0]}`}
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
              {officials.map(s => (
                <div key={s.id} className="text-center">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                    onError={(e) => e.target.src = `https://avatar.vercel.sh/${s.name}.png?text=${s.name[0]}`}
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
            {recentMatches.map(m => (
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
            ))}
          </div>
        </section>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Fixtures</h2>
            <div className="space-y-3">
              {upcoming.map(u => (
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