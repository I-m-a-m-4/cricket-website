// src/pages/LiveScorePage.jsx
import React, { useState, useEffect } from 'react';
import { fetchLiveMatches, fetchRecentMatches } from '../utils/api';

export default function LiveScorePage() {
    const [liveMatches, setLiveMatches] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedMatchId, setExpandedMatchId] = useState(null);

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
        if (!team) return { name: 'Unknown', flag: null };
        return {
            name: team.name || 'Unknown',
            flag: team.image_path || null
        };
    };

    // Status badge color
    const getStatusColor = (status) => {
        if (status?.includes('1st')) return 'bg-yellow-100 text-yellow-800';
        if (status?.includes('2nd')) return 'bg-blue-100 text-blue-800';
        if (status?.includes('Finished')) return 'bg-green-100 text-green-800';
        return 'bg-gray-100 text-gray-800';
    };

    // Get last ball event from `balls` data
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

    // Fetch live and recent matches
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

        // Refresh every 5 minutes
        const interval = setInterval(fetchData, 300000); // 5 * 60 * 1000
        return () => clearInterval(interval);
    }, []);

    // SEO-friendly page metadata (simulated via document.title and meta)
    useEffect(() => {
        document.title = "Live Cricket Scores - Real-Time Updates & Recent Results";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                "Get live cricket scores, real-time updates, and recent match results. Follow ongoing matches with ball-by-ball commentary and stats."
            );
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Get live cricket scores, real-time updates, and recent match results.";
            document.head.appendChild(meta);
        }

        return () => {
            // Cleanup if needed
        };
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">🏏 Live Cricket Scores</h1>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6 text-center text-gray-500">Loading live matches...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* SEO-Friendly Heading */}
            <header className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
                    🏏 Live Cricket Scores
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
                    Follow real-time cricket scores, ball-by-ball updates, and recent match results from major leagues around the world.
                </p>
            </header>

            {/* Live Matches Table */}
            {liveMatches.length > 0 ? (
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">🔥 Live Matches</h2>
                    <div className="overflow-x-auto shadow-lg rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Match</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Score</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">RR</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Venue</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">League</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {liveMatches.map((match) => {
                                    const localTeam = getTeamInfo(match.localteam);
                                    const visitorTeam = getTeamInfo(match.visitorteam);
                                    const league = match.league?.name || 'Unknown';
                                    const venue = match.venue?.name || 'Unknown';
                                    const status = match.status || 'In Progress';
                                    const note = match.note || '';

                                    const localScore = match.localteam_score?.score ?? match.runs?.find(r => r.team_id === match.localteam_id)?.score;
                                    const localWickets = match.localteam_score?.wickets ?? match.runs?.find(r => r.team_id === match.localteam_id)?.wickets_out;
                                    const localOvers = match.localteam_score?.overs ?? match.runs?.find(r => r.team_id === match.localteam_id)?.overs;

                                    const visitorScore = match.visitorteam_score?.score ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.score;
                                    const visitorWickets = match.visitorteam_score?.wickets ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.wickets_out;
                                    const visitorOvers = match.visitorteam_score?.overs ?? match.runs?.find(r => r.team_id === match.visitorteam_id)?.overs;

                                    const lastEvent = getLastEvent(match.balls?.data);
                                    const isExpanded = expandedMatchId === match.id;

                                    return (
                                        <React.Fragment key={match.id}>
                                            <tr
                                                onClick={() => setExpandedMatchId(isExpanded ? null : match.id)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        {localTeam.flag && (
                                                            <img src={localTeam.flag} alt={localTeam.name} className="w-8 h-8 rounded-full border" />
                                                        )}
                                                        <span className="font-semibold text-gray-800">{localTeam.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        {visitorTeam.flag && (
                                                            <img src={visitorTeam.flag} alt={visitorTeam.name} className="w-8 h-8 rounded-full border" />
                                                        )}
                                                        <span className="font-semibold text-gray-800">{visitorTeam.name}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 font-medium">{match.type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                                                        {status}
                                                    </span>
                                                    {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-lg">{formatScore(localScore, localWickets, localOvers)}</div>
                                                    <div className="font-bold text-lg">{formatScore(visitorScore, visitorWickets, visitorOvers)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div>{calculateRunRate(localScore, localOvers)}</div>
                                                    <div>{calculateRunRate(visitorScore, visitorOvers)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{venue}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{league}</td>
                                            </tr>

                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="6" className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            {lastEvent && (
                                                                <div>
                                                                    <h3 className="font-medium text-gray-800 mb-2">🎯 Last Ball</h3>
                                                                    <p className="text-sm text-orange-600 font-medium">
                                                                        {lastEvent.comment} (Over {lastEvent.over}.{lastEvent.ball})
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h3 className="font-medium text-gray-800 mb-2">🏟️ Venue</h3>
                                                                <p className="text-sm">{venue}</p>
                                                            </div>
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
                <section className="text-center py-14 bg-gray-50 rounded-xl mb-12">
                    <h2 className="text-2xl font-semibold text-gray-700">No live matches currently in progress.</h2>
                    <p className="text-gray-500 mt-2">Check back later or view recent results below.</p>
                </section>
            )}

            {/* Recent Matches */}
            {recentMatches.length > 0 && (
                <section className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">🏆 Recent Results</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Match</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Result</th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Venue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentMatches.map((match) => {
                                    const localTeam = getTeamInfo(match.localteam);
                                    const visitorTeam = getTeamInfo(match.visitorteam);
                                    const winnerName = match.winner_team_id === match.localteam_id
                                        ? localTeam.name
                                        : match.winner_team_id === match.visitorteam_id
                                            ? visitorTeam.name
                                            : 'No Result';

                                    return (
                                        <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {localTeam.flag && (
                                                        <img src={localTeam.flag} alt={localTeam.name} className="w-7 h-7 rounded-full border" />
                                                    )}
                                                    <span className="text-sm font-medium">{localTeam.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {visitorTeam.flag && (
                                                        <img src={visitorTeam.flag} alt={visitorTeam.name} className="w-7 h-7 rounded-full border" />
                                                    )}
                                                    <span className="text-sm font-medium">{visitorTeam.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-semibold text-green-700">{winnerName} won</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{match.venue?.name || 'Unknown'}</td>
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