import React, { useState, useEffect } from 'react';
import { fetchLiveMatches, fetchRecentMatches } from '../utils/api';

// League Logos (Place these in /public/)
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

export default function LiveScorePage() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  // Log component mount
  useEffect(() => {
    console.log('LiveScorePage mounted');
    return () => console.log('LiveScorePage unmounted');
  }, []);

  // Format overs: 16.4 → "16.4"
  const formatOvers = (overs) => {
    if (overs === null || overs === undefined) return '—';
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  };

  // Format score safely
  const formatScore = (score, wickets, overs) => {
    if (score === null || score === undefined) return '—';
    if (wickets === null || wickets === undefined) return `${score}/—`;
    if (overs === null || overs === undefined) return `${score}/${wickets}`;
    return `${score}/${wickets} (${formatOvers(overs)})`;
  };

  // Calculate run rate
  const calculateRunRate = (score, overs) => {
    if (!score || !overs) return '—';
    const rr = score / overs;
    return rr.toFixed(2);
  };

  // Get team info with flag
  const getTeamInfo = (team) => {
    if (!team) return { name: 'Unknown', flag: '/placeholder-team.png' };
    return {
      name: team.name || 'Unknown',
      flag: team.image_path || '/placeholder-team.png'
    };
  };

  // Get league logo
  const getLeagueLogo = (leagueName) => {
    const logo = LEAGUE_LOGOS[leagueName] || LEAGUE_LOGOS.default;
    console.log(`Loading logo for ${leagueName}: ${logo}`);
    return logo;
  };

  // Status badge color
  const getStatusColor = (status) => {
    if (status?.includes('1st')) return 'bg-yellow-100 text-yellow-800';
    if (status?.includes('2nd')) return 'bg-blue-100 text-blue-800';
    if (status?.includes('Finished')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Get result type (e.g., "won by 6 wickets")
  const getResultType = (match) => {
    if (!match.winner_team_id) return 'No Result';
    const isHomeWin = match.winner_team_id === match.localteam_id;
    const winner = isHomeWin ? match.localteam?.name : match.visitorteam?.name;
    const margin = match.draw_noresult ? 'No Result' : match.winner_type;

    if (margin === 'wickets') {
      const wonBy = isHomeWin ? match.localteam_result : match.visitorteam_result;
      return `${winner} won by ${wonBy} wickets`;
    } else if (margin === 'runs') {
      const runs = isHomeWin ? match.localteam_result : match.visitorteam_result;
      return `${winner} won by ${runs} runs`;
    }
    return `${winner} won`;
  };

  // Get last ball event
  const getLastEvent = (ballsData) => {
    if (!Array.isArray(ballsData) || ballsData.length === 0) return null;
    const lastBall = ballsData[ballsData.length - 1];
    const comment = [];

    if (lastBall.batsmanout) comment.push('WICKET ⚰️');
    else if (lastBall.score?.run === 6) comment.push('SIX 🎉');
    else if (lastBall.score?.run === 4) comment.push('FOUR 🏏');
    else if (lastBall.score?.run > 0) comment.push(`${lastBall.score.run} runs`);
    else comment.push('Dot ball');

    return {
      comment: comment.join(', '),
      over: lastBall.over_number,
      ball: lastBall.ball_number
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [live, recent] = await Promise.all([
          fetchLiveMatches(),
          fetchRecentMatches()
        ]);
        setLiveMatches(Array.isArray(live) ? live : []);
        setRecentMatches(Array.isArray(recent) ? recent : []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  // SEO Meta
  useEffect(() => {
    document.title = "Live Cricket Scores | Real-Time Updates & Results";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "Live cricket scores, ball-by-ball updates, standings, and news. Follow IPL, The Ashes, World Cup & more.");
    }
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent mb-8">
          🏏 Live Cricket Scores
        </h1>
        <div className="animate-pulse space-y-6">
          {Array(3).fill().map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🏏 Live Cricket Scores
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Follow real-time match updates, ball-by-ball commentary, and recent results from top cricket leagues worldwide.
        </p>
      </header>

      {/* 🔴 Live Matches Table */}
      {liveMatches.length > 0 ? (
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">🔥 Live Matches</h2>
          <div className="overflow-x-auto shadow-lg rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-[#122e47] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Innings</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">RR</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Target</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Venue</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">League</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {liveMatches.map((match) => {
                  const localTeam = getTeamInfo(match.localteam);
                  const visitorTeam = getTeamInfo(match.visitorteam);
                  const leagueName = match.league?.name || 'Unknown';
                  const leagueLogo = getLeagueLogo(leagueName);
                  const venue = match.venue?.name || 'Unknown';
                  const status = match.status || 'In Progress';
                  const note = match.note || ''; // e.g., "Target 184 runs"
                  const isExpanded = expandedMatchId === match.id;

                  const localScore = match.localteam_score?.score ?? match.runs?.find(r => r.team_id === match.localteam_id)?.score;
                  const localWickets = match.localteam_score?.wickets ?? match.runs?.find(r => r.team_id === match.localteam_id)?.wickets_out;
                  const localOvers = match.localteam_score?.overs ?? match.runs?.find(r => r.team_id === match.localteam_id)?.overs;

                  const visitorScore = match.visitorteam_score?.score ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.score;
                  const visitorWickets = match.visitorteam_score?.wickets ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.wickets_out;
                  const visitorOvers = match.visitorteam_score?.overs ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.overs;

                  const lastEvent = getLastEvent(match.balls?.data);

                  return (
                    <React.Fragment key={match.id}>
                      <tr
                        onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <img src={localTeam.flag} alt={localTeam.name} className="w-8 h-8 rounded-full border" onError={(e) => console.error(`Failed to load flag for ${localTeam.name}: ${e.target.src}`)} />
                            <span className="font-bold text-gray-900">{localTeam.name}</span>
                            <img src="/vs.png" alt="vs" className="w-5 h-5 inline-block mx-2" onError={(e) => console.error('Failed to load vs.png')} />
                            <span className="font-bold text-gray-900">{visitorTeam.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{match.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-lg">{formatScore(localScore, localWickets, localOvers)}</div>
                          <div className="font-bold text-lg">{formatScore(visitorScore, visitorWickets, visitorOvers)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>{calculateRunRate(localScore, localOvers)}</div>
                          <div>{calculateRunRate(visitorScore, visitorOvers)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                          {note ? note.replace('Target ', '') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{venue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <img src={leagueLogo} alt={leagueName} className="w-6 h-6 rounded" onError={(e) => console.error(`Failed to load logo for ${leagueName}: ${e.target.src}`)} />
                            <span className="text-sm font-medium text-indigo-700">{leagueName}</span>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              {lastEvent && (
                                <div>
                                  <h3 className="font-bold text-gray-800 mb-1">🎯 Last Ball</h3>
                                  <p className="text-orange-600">{lastEvent.comment} (Over {lastEvent.over}.{lastEvent.ball})</p>
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold text-gray-800 mb-1">🏟️ Venue</h3>
                                <p>{venue}</p>
                              </div>
                              {match.toss_won_team_id && (
                                <div>
                                  <h3 className="font-bold text-gray-800 mb-1">🪙 Toss</h3>
                                  <p>{match.toss_won_team_id === match.localteam_id ? localTeam.name : visitorTeam.name} won toss, elected to {match.elected}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold text-gray-700">No live matches right now</h2>
          <p className="text-gray-500 mt-2">Check back soon or view recent results below.</p>
        </div>
      )}

      {/* 🟡 Recent Matches Table */}
      {recentMatches.length > 0 && (
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">🏆 Recent Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#122e47] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Result</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">Venue</th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap">League</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentMatches.map((match) => {
                  const localTeam = getTeamInfo(match.localteam);
                  const visitorTeam = getTeamInfo(match.visitorteam);
                  const leagueName = match.league?.name || 'Unknown';
                  const leagueLogo = getLeagueLogo(leagueName);

                  const localScore = match.runs?.find(r => r.team_id === match.localteam_id);
                  const visitorScore = match.runs?.find(r => r.team_id === match.visitorteam_id);

                  const resultText = getResultType(match);

                  return (
                    <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img src={localTeam.flag} alt={localTeam.name} className="w-7 h-7 rounded-full" onError={(e) => console.error(`Failed to load flag for ${localTeam.name}: ${e.target.src}`)} />
                          <span className="font-bold text-gray-900">{localTeam.name}</span>
                          <img src="/vs.png" alt="vs" className="w-5 h-5 inline-block mx-2" onError={(e) => console.error('Failed to load vs.png')} />
                          <span className="font-bold text-gray-900">{visitorTeam.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>{formatScore(localScore?.score, localScore?.wickets_out, localScore?.overs)}</div>
                        <div>{formatScore(visitorScore?.score, visitorScore?.wickets_out, visitorScore?.overs)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-green-700">{resultText}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{match.venue?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img src={leagueLogo} alt={leagueName} className="w-6 h-6 rounded" onError={(e) => console.error(`Failed to load logo for ${leagueName}: ${e.target.src}`)} />
                          <span className="text-sm font-medium text-indigo-700">{leagueName}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}