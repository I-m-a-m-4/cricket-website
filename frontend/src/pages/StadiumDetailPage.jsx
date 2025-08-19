import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

export default function StadiumDetailPage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/venues/${id}`, { timeout: 10000 });
        console.log('Venue Response:', response.data); // Debug API response
        setVenue(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Venue Error:', err);
        setError(err.response?.data?.error || 'Failed to load stadium details.');
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 text-lg">{error || 'Stadium not found'}</p>
          <Link to="/stadiums" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Stadiums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          <span className="text-blue-600">Stadium</span> Details
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-1">
            <div className="relative w-full h-96 bg-gray-200 overflow-hidden shadow-lg rounded-lg">
              <img
                src={venue.image_path || '/icc.jpg'}
                alt={venue.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/icc.jpg'; }}
              />
              <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded">
                <span className="text-gray-800 font-semibold">{venue.name}</span>
              </div>
            </div>
          </div>
          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{venue.name}</h2>
              <p className="text-gray-700 mb-4">
                <strong>Location:</strong> {venue.city || 'N/A'}, {venue.country_name || 'N/A'}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Capacity:</strong> {venue.capacity || 'N/A'}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Floodlights:</strong> {venue.floodlight ? 'Yes' : 'No'}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Description:</strong> {venue.description || 'A renowned cricket venue known for its vibrant atmosphere and historic matches.'}
              </p>
              <Link to="/stadiums" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                ← Back to Stadiums
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}