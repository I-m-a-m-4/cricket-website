import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MatchPage() {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch match details from your backend using the `id`
    // e.g., fetchMatchDetails(id).then(data => setMatchData(data));
    console.log(`Fetching details for match with ID: ${id}`);
    
    // Placeholder data for now
    setTimeout(() => {
      setMatchData({
        id: id,
        team1: "Team A",
        team2: "Team B",
        score: "250/5",
        overs: "40.3",
        venue: "Stadium XYZ",
        commentary: ["Ball 1: Four!", "Ball 2: Wicket!"]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-primary font-open-sans">Loading match details...</div>;
  }

  if (!matchData) {
    return <div className="text-center mt-20 text-red-500 font-open-sans">Match not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 font-open-sans">
      <h1 className="text-4xl font-extrabold font-cab text-dark-bg text-center my-8">
        {matchData.team1} vs {matchData.team2}
      </h1>
      <div className="bg-light-bg rounded-lg shadow-md p-6">
        <p className="text-xl font-bold text-dark-bg">Score: {matchData.score}</p>
        <p className="text-gray-600">Overs: {matchData.overs}</p>
        <p className="text-gray-600">Venue: {matchData.venue}</p>
        <h2 className="text-2xl font-bold font-cab mt-6">Live Commentary</h2>
        <ul className="list-disc list-inside mt-2">
          {matchData.commentary.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MatchPage;