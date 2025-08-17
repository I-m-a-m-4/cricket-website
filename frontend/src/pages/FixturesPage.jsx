import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAllMatches,
  fetchLiveMatches,
  fetchUpcomingMatches,
  fetchPastMatches,
} from '../utils/api';
import MatchCardSkeleton from '../components/MatchCardSkeleton';

const LEAGUE_LOGOS = {
  'The Hundred': '/th.png',
  'The Women\'s Hundred': '/thw.jpeg',
  'IPL': '/TL.png',
  'Big Bash League': '/bb.jpg',
  'The Ashes': '/rw.png',
  'ICC World Cup': '/icc.jpg',
  'PSL': '/rw.png',
  'Test Series': '/test.jpg',
  'Super Smash': '/ss.png',
  'Royal London One-Day Cup': '/rw.jpg',
  'T20 Blast': '/t20.jpg',
  'CPL': '/cpl.png',
  default: '/icc.jpg'
};

function FixturesPageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded mb-8 w-48"></div>
        <div className="space-y-12">
          {['live', 'upcoming', 'finished'].map((section) => (
            <div key={section}>
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 overflow-x-auto">
                <table className="w-full text-left text-gray-900 table-auto min-w-[600px]">
                  <thead className="bg-[#122e47] text-white">
                    <tr className="border-b border-gray-300">
                      <th className="py-3 px-4 font-bold">Match</th>
                      <th className="py-3 px-4 font-bold">League</th>
                      <th className="py-3 px-4 font-bold">Venue</th>
                      <th className="py-3 px-4 font-bold">Date</th>
                      <th className="py-3 px-4 font-bold">Format</th>
                      <th className="py-3 px-4 font-bold">Score/Result</th>
                      <th className="py-3 px-4 font-bold">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-3/4"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-1/2"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-2/3"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-1/3"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-1/4"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-1/2"></div></td>
                        <td className="py-3 px-4"><div className="h-5 bg-gray-300 rounded w-1/4"></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FixturesPage() {
  const [matches, setMatches] = useState({
    live: [],
    upcoming: [],
    finished: [],
    all: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formatFilter, setFormatFilter] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  // Extract leagues and teams
  const leagues = useMemo(() => {
    const unique = new Set(
      matches.all.map((m) => m.league?.name).filter(Boolean)
    );
    return [...unique].sort();
  }, [matches.all]);

  const teams = useMemo(() => {
    const unique = new Set(
      matches.all.flatMap((m) => [m.localteam?.name, m.visitorteam?.name]).filter(Boolean)
    );
    return [...unique].sort();
  }, [matches.all]);

  // Filtered matches
  const filteredLive = useMemo(() => {
    return matches.live.filter((match) => {
      return (
        (!formatFilter || match.type === formatFilter) &&
        (!leagueFilter || match.league?.name === leagueFilter) &&
        (!teamFilter ||
          match.localteam?.name === teamFilter ||
          match.visitorteam?.name === teamFilter)
      );
    });
  }, [matches.live, formatFilter, leagueFilter, teamFilter]);

  const filteredUpcoming = useMemo(() => {
    return matches.upcoming
      .filter((m) => m.status === 'Fixture')
      .filter((match) => {
        return (
          (!formatFilter || match.type === formatFilter) &&
          (!leagueFilter || match.league?.name === leagueFilter) &&
          (!teamFilter ||
            match.localteam?.name === teamFilter ||
            match.visitorteam?.name === teamFilter)
        );
      });
  }, [matches.upcoming, formatFilter, leagueFilter, teamFilter]);

  const filteredFinished = useMemo(() => {
    return matches.finished.filter((match) => {
      return (
        (!formatFilter || match.type === formatFilter) &&
        (!leagueFilter || match.league?.name === leagueFilter) &&
        (!teamFilter ||
          match.localteam?.name === teamFilter ||
          match.visitorteam?.name === teamFilter)
      );
    });
  }, [matches.finished, formatFilter, leagueFilter, teamFilter]);

  // Data fetching
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [live, upcoming, finished, all] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches(),
          fetchPastMatches(),
          fetchAllMatches(),
        ]);

        setMatches({
          live: Array.isArray(live) ? live : [],
          upcoming: Array.isArray(upcoming) ? upcoming : [],
          finished: Array.isArray(finished) ? finished : [],
          all: Array.isArray(all) ? all : [],
        });
      } catch (err) {
        setError('Failed to load fixtures.');
        console.error('Error loading fixtures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Render section
  const renderSection = (title, matchList, id) => {
    if (!matchList || matchList.length === 0) return null;

    return (
      <section key={id} className="mb-12">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">{title}</h2>
        {id === 'upcoming' && (
          <div className="mb-6">
            <table className="w-full max-w-md text-left text-gray-900 border border-gray-200 rounded-lg">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Format</td>
                  <td className="py-3 px-4">
                    <select
                      value={formatFilter}
                      onChange={(e) => setFormatFilter(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">All Formats</option>
                      <option value="T20">T20</option>
                      <option value="ODI">ODI</option>
                      <option value="Test">Test</option>
                      <option value="T10">T10</option>
                      <option value="List A">List A</option>
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">League</td>
                  <td className="py-3 px-4">
                    <select
                      value={leagueFilter}
                      onChange={(e) => setLeagueFilter(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">All Leagues</option>
                      {leagues.map((league) => (
                        <option key={league} value={league}>
                          {league}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Team</td>
                  <td className="py-3 px-4">
                    <select
                      value={teamFilter}
                      onChange={(e) => setTeamFilter(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">All Teams</option>
                      {teams.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {matchList.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 overflow-x-auto">
            <table className="w-full text-left text-gray-900 table-auto min-w-[600px]">
              <thead className="bg-[#122e47] text-white">
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-4 font-bold">Match</th>
                  <th className="py-3 px-4 font-bold">League</th>
                  <th className="py-3 px-4 font-bold">Venue</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Format</th>
                  <th className="py-3 px-4 font-bold">Score/Result</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody>
                {matchList.map((match) => {
                  const score = match.runs?.find(r => r.team_id === match.localteam_id || r.team_id === match.visitorteam_id)
                    ? `${match.runs.find(r => r.team_id === match.localteam_id)?.score || 0}/${match.runs.find(r => r.team_id === match.localteam_id)?.wickets || 0} (${match.runs.find(r => r.team_id === match.localteam_id)?.overs || 0})`
                    : match.note || 'N/A';
                  return (
                    <tr
                      key={match.id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 font-bold text-gray-900">
                        {match.localteam?.name || 'Team A'}
                        <img
                          src="/vs.png"
                          alt="vs"
                          className="w-5 h-5 inline-block mx-2"
                        />
                        {match.visitorteam?.name || 'Team B'}
                      </td>
                      <td className="py-3 px-4 flex items-center gap-2 text-gray-800">
                        <img
                          src={LEAGUE_LOGOS[match.league?.name] || LEAGUE_LOGOS.default}
                          alt={match.league?.name || 'League'}
                          className="w-6 h-6 object-contain"
                          onError={(e) => (e.target.src = LEAGUE_LOGOS.default)}
                        />
                        <span>{match.league?.name || 'Unknown'}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-800">{match.venue?.name || 'TBD'}</td>
                      <td className="py-3 px-4 text-gray-800">
                        {match.starting_at
                          ? new Date(match.starting_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'TBD'}
                      </td>
                      <td className="py-3 px-4 text-gray-800">{match.type || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-800">{score}</td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/match/${match.id}`}
                          className="inline-block bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No matches match your filters.</p>
        )}
      </section>
    );
  };

  if (loading) return <FixturesPageSkeleton />;
  if (error)
    return (
      <div className="container mx-auto px-6 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <meta name="description" content="Live, upcoming, and recent cricket matches. Real-time scores, schedules, and results." />
      <meta name="keywords" content="cricket, live scores, fixtures, match schedule, ODI, T20, IPL, World Cup" />
      <meta name="robots" content="index, follow" />
      <title>Cricket Hub - Live & Upcoming Matches</title>

      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Cricket Fixtures</h1>
        <p className="text-gray-600 mb-10">Stay updated with real-time scores and upcoming games.</p>

        {renderSection('🔴 Live Matches', filteredLive, 'live')}
        {renderSection('📅 Upcoming Matches', filteredUpcoming, 'upcoming')}
        {renderSection('✅ Finished Matches', filteredFinished, 'finished')}
      </div>
    </div>
  );
}

export default FixturesPage;