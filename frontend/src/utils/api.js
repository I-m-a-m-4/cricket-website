import axios from 'axios';

// Get the base URL from the environment variables.
let BASE_URL;
const API_TOKEN = import.meta.env.VITE_SPORTMONKS_API_TOKEN;

// Correctly set the BASE_URL based on the environment.
// This is the most reliable way to handle environment variables with Vite.
if (import.meta.env.MODE === 'production') {
    BASE_URL = import.meta.env.VITE_RENDER_URL;
    if (!BASE_URL || !BASE_URL.startsWith('https://')) {
        console.error("Critical Error: VITE_RENDER_URL environment variable is not defined or is invalid in production.");
    }
} else {
    // If we're in development, use the local API
    BASE_URL = 'http://localhost:3001/api';
}

export const fetchAllMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all matches:", error);
        return [];
    }
};

export const fetchTeamRankings = async (type, gender) => {
    try {
        const response = await axios.get(`${BASE_URL}/team-rankings/global`, {
            params: {
                type,
                gender
            }
        });
        // Find the ranking object matching the requested type and gender, then return its team array
        const ranking = response.data.find(r => r.type === type.toUpperCase() && r.gender === gender.toLowerCase());
        return ranking ? ranking.team.slice(0, 5) : []; // Return top 5 teams or empty array if not found
    } catch (error) {
        console.error('Error fetching team rankings:', error);
        throw error;
    }
};

export const fetchAusIndMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/aus-ind`);
        return response.data;
    } catch (error) {
        console.error("Error fetching AUS vs IND matches:", error);
        return [];
    }
};

export const fetchLegendsLeagueMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/legends-league`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Legends League matches:", error);
        return [];
    }
};

export const fetchLiveMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/live`);
        return response.data;
    } catch (error) {
        console.error("Error fetching live matches:", error);
        return [];
    }
};

export const fetchUpcomingMatches = async () => {
  if (!API_TOKEN) {
    throw new Error('API_TOKEN is not defined. Please set REACT_APP_SPORTMONKS_API_TOKEN in your .env file.');
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // e.g., 2025-08-14
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]; // e.g., 2025-08-21
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        api_token: API_TOKEN,
        filter: `starts_between=${today},${nextWeek}`,
        include: 'localteam,visitorteam,league',
      },
    });
    return response.data.data; // Sportmonks wraps data in a 'data' array
  } catch (error) {
    console.error('Error fetching upcoming matches:', error.message);
    throw error; // Let the component handle the error
  }
};
export const fetchNews = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/news`);
        return response.data;
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};

export const fetchStandings = async (seasonId) => {
    try {
        const response = await axios.get(`${BASE_URL}/standings/${seasonId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching standings:", error);
        return [];
    }
};

export const fetchTopPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/players/top`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top players:", error);
        return [];
    }
};

export const fetchPastMatches = async () => {
    const params = {
        'filter[status]': 'Finished',
        'include': 'localteam,visitorteam,league,venue,runs'
    };
    return fetchData('/fixtures', params);
};


export const fetchTeams = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teams`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teams:", error);
        return [];
    }
};

export const fetchLeagues = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/leagues`);
        return response.data;
    } catch (error) {
        console.error("Error fetching leagues:", error);
        return [];
    }
};


export const fetchVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/videos`);
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
};

export const fetchFixtures = async () => {
  if (!API_TOKEN) {
    throw new Error('API_TOKEN is not defined. Please set REACT_APP_SPORTMONKS_API_TOKEN in your .env file.');
  }

  try {
    const today = new Date().toISOString().split('T')[0]; // e.g., 2025-08-15
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]; // e.g., 2025-08-22
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        api_token: API_TOKEN,
        filter: `starts_between=${today},${nextWeek}`,
        include: 'manofseries,localteam,visitorteam,league',
      },
    });
    return response.data.data; // Sportmonks wraps fixtures in a 'data' array
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
    throw error;
  }
};