import React, { useState, useEffect } from 'react';
import { fetchLeagues } from '../utils/api';

export default function KeySeriesSection() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeLeagueId, setActiveLeagueId] = useState(null); // Track the active button by league ID

    useEffect(() => {
        const getLeagues = async () => {
            try {
                const leaguesData = await fetchLeagues();
                setLeagues(leaguesData.slice(0, 7)); // Displaying a fixed number of key series
            } catch (error) {
                console.error("Failed to fetch leagues:", error);
            } finally {
                setLoading(false);
            }
        };
        getLeagues();
    }, []);

    if (loading) {
        return (
            <section className="relative h-96 bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
            </section>
        );
    }

    if (leagues.length === 0) {
        return null; // Don't render if no leagues are found
    }
    
    // Choose the first league to be the "featured" one with the red gradient
    const featuredLeague = leagues[0];
    const otherLeagues = leagues.slice(1);

    // Handle button click to set the active league
    const handleButtonClick = (leagueId) => {
        setActiveLeagueId(leagueId === activeLeagueId ? null : leagueId); // Toggle active state
    };

    return (
        <section className="relative py-20 px-4 text-white">
            <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(/hero-bg.png)` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-blue-900/90 opacity-80"></div>

            <div className="relative max-w-5xl mx-auto text-center">
                <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>Key Series</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-12">
                    Explore the biggest leagues and tournaments happening around the globe, with real-time updates and detailed information.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    {/* Featured button with red gradient when active */}
                    <button
                        onClick={() => handleButtonClick(featuredLeague.id)}
                        className={`font-bold py-2 px-6 rounded-full shadow-md hover:scale-105 transition-transform duration-300 ${
                            activeLeagueId === featuredLeague.id
                                ? 'bg-gradient-to-r from-[#DD242D] to-[#FF4535] text-white'
                                : 'bg-gradient-to-r from-[#DD242D] to-[#FF4535] text-white'
                        }`}
                    >
                        {featuredLeague.name}
                    </button>
                    
                    {/* Other series buttons */}
                    {otherLeagues.map((league) => (
                        <button
                            key={league.id}
                            onClick={() => handleButtonClick(league.id)}
                            className={`font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-200 transition-colors duration-300 ${
                                activeLeagueId === league.id
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white text-gray-800'
                            }`}
                        >
                            {league.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}