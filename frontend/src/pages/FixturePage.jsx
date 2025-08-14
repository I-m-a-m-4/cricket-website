import React, { useState, useEffect } from 'react';
import { fetchFixtures } from '../utils/api';

function FixturePage() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFixtures = async () => {
      setLoading(true);
      setError(null);
      try {
        const fixturesData = await fetchFixtures();
        setFixtures(fixturesData);
      } catch (err) {
        setError('Failed to load fixtures due to a network or API issue.');
        console.error('Error fetching fixtures:', err);
      } finally {
        setLoading(false);
      }
    };
    getFixtures();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-6 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (fixtures.length === 0) {
    return (
      <section className="container mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">No fixtures scheduled for the next 7 days.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>Upcoming Fixtures</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={`https://placehold.co/300x200/e5e7eb/6b7280?text=${fixture.round}`}
                alt={`${fixture.round} Fixture`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-[#D30A11] text-white text-xs font-bold px-3 py-1 rounded-tr-xl">
                {fixture.league?.name || 'Cricket League'}
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{fixture.round}</h3>
              <p className="text-gray-600 mb-2">
                {fixture.localteam?.name} vs {fixture.visitorteam?.name}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(fixture.starting_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })}
              </p>
              {fixture.manofseries && (
                <p className="text-gray-700 mt-2">
                  Man of Series: {fixture.manofseries?.fullname || 'TBD'}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FixturePage;