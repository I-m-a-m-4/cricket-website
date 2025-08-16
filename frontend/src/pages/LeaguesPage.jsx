import React, { useState, useEffect } from 'react';
import { fetchSeasons } from '../utils/api';

export default function LeaguesPage() {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLeagueId, setExpandedLeagueId] = useState(null);

    useEffect(() => {
        const getSeasons = async () => {
            try {
                const seasonsData = await fetchSeasons();
                const leaguesMap = new Map();
                seasonsData.forEach(season => {
                    if (!leaguesMap.has(season.league_id)) {
                        leaguesMap.set(season.league_id, {
                            id: season.league_id,
                            name: season.league?.name || 'Unknown League',
                            seasons: [],
                            fixtures: season.fixtures?.data || [],
                            standings: season.standings?.data || []
                        });
                    }
                    const league = leaguesMap.get(season.league_id);
                    league.seasons.push(season);
                });
                setSeasons(Array.from(leaguesMap.values()));
            } catch (error) {
                console.error("Failed to fetch seasons:", error);
            } finally {
                setLoading(false);
            }
        };
        getSeasons();
    }, []);

    const toggleLeague = (leagueId) => {
        setExpandedLeagueId(expandedLeagueId === leagueId ? null : leagueId);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <div className="space-y-6">
                    {Array(5).fill().map((_, index) => (
                        <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-20"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (seasons.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-600">No leagues or seasons available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>Leagues</h1>
            <div className="space-y-6">
                {seasons.map((league) => (
                    <div key={league.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <button
                            onClick={() => toggleLeague(league.id)}
                            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 transition-colors duration-300 flex justify-between items-center"
                        >
                            <span className="text-xl font-semibold">{league.name}</span>
                            <span>{expandedLeagueId === league.id ? '−' : '+'}</span>
                        </button>
                        {expandedLeagueId === league.id && (
                            <div className="p-4">
                                {/* Seasons */}
                                {league.seasons.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium mb-2">Seasons</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {league.seasons.map((season) => (
                                                <li key={season.id}>{season.name} ({season.code})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Fixtures */}
                                {league.fixtures.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium mb-2">Recent Fixtures</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {league.fixtures.slice(0, 5).map((fixture) => (
                                                <li key={fixture.id}>
                                                    {fixture.localteam?.name} vs {fixture.visitorteam?.name} - {new Date(fixture.starting_at).toLocaleDateString()}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Standings */}
                                {league.standings.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Standings</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {league.standings.slice(0, 5).map((standing, index) => (
                                                <li key={standing.id}>
                                                    {index + 1}. {standing.team?.name || 'Unknown Team'} - {standing.position || 'N/A'} pts
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {league.seasons.length === 0 && league.fixtures.length === 0 && league.standings.length === 0 && (
                                    <p className="text-gray-500">No additional data available.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}