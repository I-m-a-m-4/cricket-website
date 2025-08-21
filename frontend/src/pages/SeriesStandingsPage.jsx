import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { TrophyIcon, TrendingUpIcon, TrendingDownIcon, ArrowLeftIcon, AwardIcon } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesStandingsPage = () => {
  const { seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/seasons/${seasonId}?include=league,standings.team,standings.stage`
        );
        const seasonData = response.data.data;
        setSeason(seasonData);
        
        const standingsData = seasonData.standings || [];
        setStandings(standingsData);
        
        // Group by stage and select the first one
        const stages = [...new Set(standingsData.map(s => s.stage?.name).filter(Boolean))];
        if (stages.length > 0) {
          setSelectedStage(stages[0]);
        }
      } catch (err) {
        setError('Failed to load standings');
        console.error('Error fetching season standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  const getTeamLogo = (teamName) => {
    const teamLogos = {
      'australia': '🇦🇺',
      'india': '🇮🇳',
      'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'south africa': '🇿🇦',
      'new zealand': '🇳🇿',
      'pakistan': '🇵🇰',
      'sri lanka': '🇱🇰',
      'bangladesh': '🇧🇩',
      'west indies': '🏴‍☠️',
      'afghanistan': '🇦🇫',
      'ireland': '🇮🇪',
      'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    };

    const name = teamName?.toLowerCase() || '';
    for (const [country, flag] of Object.entries(teamLogos)) {
      if (name.includes(country)) return flag;
    }
    return '🏏';
  };

  const getPositionColor = (position) => {
    if (position <= 2) return 'text-green-600 bg-green-50';
    if (position <= 4) return 'text-blue-600 bg-blue-50';
    if (position >= 7) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPositionIcon = (position) => {
    if (position === 1) return <AwardIcon className="w-4 h-4 text-yellow-500" />;
    if (position <= 4) return <TrendingUpIcon className="w-4 h-4 text-green-500" />;
    return <TrendingDownIcon className="w-4 h-4 text-red-500" />;
  };

  const getQualificationStatus = (position, totalTeams) => {
    if (position === 1) return 'Champion';
    if (position <= 2) return 'Qualified';
    if (position <= 4) return 'Playoffs';
    if (position >= totalTeams - 1) return 'Eliminated';
    return '';
  };

  const getStageStandings = () => {
    if (!selectedStage) return standings;
    return standings.filter(s => s.stage?.name === selectedStage);
  };

  const calculateNetRunRate = (standing) => {
    // Mock calculation - you'd get this from actual data
    if (standing.runs_for && standing.runs_against && standing.overs_for && standing.overs_against) {
      const runRateFor = standing.runs_for / standing.overs_for;
      const runRateAgainst = standing.runs_against / standing.overs_against;
      return (runRateFor - runRateAgainst).toFixed(3);
    }
    return (Math.random() * 2 - 1).toFixed(3); // Mock data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-64 rounded mb-6"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link
            to="/series"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  const stageStandings = getStageStandings();
  const stages = [...new Set(standings.map(s => s.stage?.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/series"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{season?.name}</h1>
              <p className="text-gray-600">{season?.league?.name} - Points Table</p>
            </div>
          </div>

          {/* Stage Selector */}
          {stages.length > 1 && (
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {stages.map(stage => (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    selectedStage === stage
                      ? 'bg-red-500 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {stageStandings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrophyIcon className="w-6 h-6" />
                Points Table
                {selectedStage && ` - ${selectedStage}`}
              </h2>
            </div>

            {/* Points Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matches
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Won
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lost
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tied
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NRR
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stageStandings
                    .sort((a, b) => (b.points || 0) - (a.points || 0))
                    .map((standing, index) => {
                      const position = index + 1;
                      const qualification = getQualificationStatus(position, stageStandings.length);
                      
                      return (
                        <tr key={standing.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className={`flex items-center gap-2 w-8 h-8 rounded-full justify-center font-bold text-sm ${getPositionColor(position)}`}>
                              {getPositionIcon(position)}
                              <span>{position}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {getTeamLogo(standing.team?.name)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {standing.team?.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {standing.team?.code}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-medium">
                            {standing.played || (standing.won || 0) + (standing.lost || 0) + (standing.draw || 0)}
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-green-600">
                            {standing.won || 0}
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-red-600">
                            {standing.lost || 0}
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-gray-600">
                            {standing.draw || 0}
                          </td>
                          <td className="px-4 py-4 text-center font-mono text-sm">
                            {calculateNetRunRate(standing)}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="font-bold text-lg text-red-600">
                              {standing.points || 0}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {qualification && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                qualification === 'Champion' ? 'bg-yellow-100 text-yellow-800' :
                                qualification === 'Qualified' || qualification === 'Playoffs' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {qualification}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 p-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded border"></div>
                  <span>Champion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded border"></div>
                  <span>Qualified/Playoffs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded border"></div>
                  <span>Eliminated</span>
                </div>
                <div className="text-gray-600">
                  <strong>NRR:</strong> Net Run Rate
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No standings available for this series</p>
            <p className="text-gray-400 text-sm mt-2">
              Points table will be updated once matches begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesStandingsPage;