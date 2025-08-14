import React from 'react';
import { useParams } from 'react-router-dom';

function TeamPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4 font-open-sans">
      <h1 className="text-4xl font-extrabold font-cab text-dark-bg text-center my-8">
        Team Profile
      </h1>
      <div className="bg-light-bg rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold font-cab text-dark-bg">
          Team ID: {id}
        </h2>
        <p className="mt-4 text-gray-700">
          This page will display details about the team, including player profiles, match history, and more.
        </p>
      </div>
    </div>
  );
}

export default TeamPage;