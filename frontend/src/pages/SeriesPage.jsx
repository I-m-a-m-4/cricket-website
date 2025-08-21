// src/pages/SeriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3001/api'
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [series, setSeries] = useState(null);
  const [standings, setStandings] = useState([]);
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('matches');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read ?tab= from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['matches', 'standings', 'points', 'news'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Fetch series data, standings, and news
  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      try {
        // Fetch season details with fixtures
        const seasonResponse = await axios.get(`${BASE_URL}/seasons/${id}`, {
          params: { include: 'league,fixtures,runs,standings,batting,bowling,scoreboards,balls' },
        });
        const seasonData = seasonResponse.data.data;
        setSeries(seasonData);

        // Fetch standings
        const standingsResponse = await axios.get(`${BASE_URL}/standings/${id}`);
        setStandings(standingsResponse.data || []);

        // Fetch news based on league name
        const leagueName = seasonData?.league?.name || 'cricket';
        const newsResponse = await axios.get(`${BASE_URL}/news`, {
          params: { q: leagueName, max: 10 },
        });
        setNews(newsResponse.data.articles || []);
      } catch (err) {
        setError('Failed to load series data. Please try again later.');
        console.error('Error fetching series:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesData();
  }, [id]);

  // Helper functions for formatting
  const formatScore = (score, wickets, overs) => {
    if (score == null) return '—';
    if (wickets == null) return `${score}/—`;
    if (overs == null) return `${score}/${wickets}`;
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${score}/${wickets} (${fullOvers}.${balls})`;
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'TBD';

  // Calculate player stats for standings
  const playerStats = useMemo(() => {
    if (!series?.fixtures) return { batsmen: [], bowlers: [] };
    const playerMap = new Map();
    series.fixtures.forEach((fixture) => {
      (fixture.batting || []).forEach((row) => {
        const player = row.batsman || row.player;
        if (!player) return;
        const pid = player.id;
        const runs = Number(row.run || row.runs || 0);
        if (runs > 0) {
          const cur = playerMap.get(pid) || {
            id: pid,
            name: player.fullname || player.name,
            team: row.team?.name || '',
            image: player.image_path || null,
            runs: 0,
            wickets: 0,
          };
          cur.runs += runs;
          playerMap.set(pid, cur);
        }
      });
      (fixture.bowling || []).forEach((row) => {
        const player = row.bowler || row.player;
        if (!player) return;
        const pid = player.id;
        const wickets = Number(row.wickets || 0);
        if (wickets > 0) {
          const cur = playerMap.get(pid) || {
            id: pid,
            name: player.fullname || player.name,
            team: row.team?.name || '',
            image: player.image_path || null,
            runs: 0,
            wickets: 0,
          };
          cur.wickets += wickets;
          playerMap.set(pid, cur);
        }
      });
    });
    const players = Array.from(playerMap.values());
    return {
      batsmen: players.filter((p) => p.runs > 0).sort((a, b) => b.runs - a.runs).slice(0, 10),
      bowlers: players.filter((p) => p.wickets > 0).sort((a, b) => b.wickets - a.wickets).slice(0, 10),
    };
  }, [series]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-gray-200 h-80 rounded-2xl mb-8"></div>
          <div className="flex space-x-4 mb-8">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <div key={tab} className="h-12 bg-gray-200 w-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600 text-xl font-semibold">{error || 'Series not found'}</p>
          <Link
            to="/series"
            className="mt-6 inline-block text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            ← Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const { name, league, fixtures = [] } = series;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-4">
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:text-red-600">Home</Link></li>
            <li><span className="text-gray-400">›</span></li>
            <li><Link to="/series" className="hover:text-red-600">Series</Link></li>
            <li><span className="text-gray-400">›</span></li>
            <li className="text-gray-900">{name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-400 text-white rounded-2xl overflow-hidden mb-12 h-80 flex items-center shadow-xl">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 p-8 flex items-center gap-4">
            {league?.image_path && (
              <img
                src={league.image_path}
                alt={league.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{name}</h1>
              <p className="text-lg mt-2">{league?.name || 'League'}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b mb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {['matches', 'standings', 'points', 'news'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  navigate(`/series/${id}?tab=${tab}`, { replace: true });
                }}
                className={`px-6 py-3 font-semibold text-lg border-b-4 transition-colors ${
                  activeTab === tab
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-red-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <main>
            {activeTab === 'matches' && (
              <div className="space-y-8">
                {['Live', 'Upcoming', 'Recent'].map((status) => {
                  const filteredFixtures = fixtures.filter((f) =>
                    status === 'Live'
                      ? f.status === 'LIVE' || f.status === 'In Progress'
                      : status === 'Upcoming'
                      ? f.status === 'NS' || f.status === 'Fixture'
                      : f.status === 'Finished'
                  );
                  return (
                    filteredFixtures.length > 0 && (
                      <section key={status}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{status} Matches</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredFixtures.map((fixture) => (
                            <Link key={fixture.id} to={`/match/${fixture.id}`} className="block">
                              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {fixture.localteam?.image_path && (
                                      <img
                                        src={fixture.localteam.image_path}
                                        alt={fixture.localteam.name}
                                        className="w-8 h-8 rounded-full"
                                      />
                                    )}
                                    <h3 className="text-lg font-semibold text-gray-800">
                                      {fixture.localteam?.name || 'Team A'} vs{' '}
                                      {fixture.visitorteam?.name || 'Team B'}
                                    </h3>
                                  </div>
                                  <span
                                    className={`text-sm font-medium ${
                                      fixture.status === 'LIVE' ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                  >
                                    {fixture.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                  {fixture.league?.name || 'League'} • {formatDate(fixture.starting_at)}
                                </p>
                                <div className="mt-3 space-y-1">
                                  {fixture.runs?.map((run) => (
                                    <p key={run.id} className="text-sm text-gray-600">
                                      {run.team_id === fixture.localteam_id
                                        ? fixture.localteam?.name
                                        : fixture.visitorteam?.name}
                                      : {formatScore(run.score, run.wickets, run.overs)}
                                    </p>
                                  ))}
                                </div>
                                {fixture.note && (
                                  <p className="text-sm text-orange-600 mt-2">{fixture.note}</p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )
                  );
                })}
                {fixtures.length === 0 && (
                  <p className="text-gray-600 text-center">No matches available.</p>
                )}
              </div>
            )}

            {activeTab === 'standings' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Player Standings</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Runs</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-gray-800 font-semibold">Player</th>
                            <th className="py-3 px-4 text-gray-800 font-semibold">Team</th>
                            <th className="py-3 px-4 text-gray-800 font-semibold">Runs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerStats.batsmen.map((player, index) => (
                            <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 flex items-center gap-2">
                                {player.image && (
                                  <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                {player.name}
                              </td>
                              <td className="py-3 px-4">{player.team}</td>
                              <td className="py-3 px-4">{player.runs}</td>
                            </tr>
                          ))}
                          {playerStats.batsmen.length === 0 && (
                            <tr>
                              <td colSpan="3" className="py-6 text-center text-gray-600">
                                No batting stats available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Wickets</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-gray-800 font-semibold">Player</th>
                            <th className="py-3 px-4 text-gray-800 font-semibold">Team</th>
                            <th className="py-3 px-4 text-gray-800 font-semibold">Wickets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {playerStats.bowlers.map((player, index) => (
                            <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 flex items-center gap-2">
                                {player.image && (
                                  <img
                                    src={player.image}
                                    alt={player.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                )}
                                {player.name}
                              </td>
                              <td className="py-3 px-4">{player.team}</td>
                              <td className="py-3 px-4">{player.wickets}</td>
                            </tr>
                          ))}
                          {playerStats.bowlers.length === 0 && (
                            <tr>
                              <td colSpan="3" className="py-6 text-center text-gray-600">
                                No bowling stats available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'points' && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Points Table</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-gray-800 font-semibold">Rank</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">Team</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">Played</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">Won</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">Lost</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">Points</th>
                        <th className="py-3 px-4 text-gray-800 font-semibold">NRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((team, index) => (
                        <tr key={team.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            {team.team?.image_path && (
                              <img
                                src={team.team.image_path}
                                alt={team.team.name}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            {team.team?.name || 'Unknown Team'}
                          </td>
                          <td className="py-3 px-4">{team.played || 0}</td>
                          <td className="py-3 px-4">{team.won || 0}</td>
                          <td className="py-3 px-4">{team.lost || 0}</td>
                          <td className="py-3 px-4">{team.points || 0}</td>
                          <td className="py-3 px-4">{team.net_run_rate || '0.00'}</td>
                        </tr>
                      ))}
                      {standings.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-6 text-center text-gray-600">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-3">{article.description}</p>
                        <div className="text-xs text-gray-400 mt-3">
                          {article.source} • {formatDate(article.publishedAt)}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
                {news.length === 0 && (
                  <p className="text-gray-600 text-center col-span-full">No news available.</p>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-80 xl:w-96">
            <div className="sticky top-20 space-y-6">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Players</h3>
                <div className="space-y-4">
                  {playerStats.batsmen.slice(0, 5).map((player) => (
                    <div key={player.id} className="flex items-center gap-3">
                      {player.image && (
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{player.name}</p>
                        <p className="text-xs text-gray-500">{player.team} • {player.runs} runs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Venues</h3>
                <div className="space-y-4">
                  {[...new Set(fixtures.map((f) => f.venue).filter((v) => v))]
                    .slice(0, 5)
                    .map((venue) => (
                      <div key={venue.id} className="flex items-center gap-3">
                        {venue.image_path && (
                          <img
                            src={venue.image_path}
                            alt={venue.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{venue.name}</p>
                          <p className="text-xs text-gray-500">{venue.city || 'Unknown'}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;