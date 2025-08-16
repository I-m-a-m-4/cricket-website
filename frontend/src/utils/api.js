import axios from 'axios';

// Get the base URL from the environment variables.
let BASE_URL;
if (import.meta.env.MODE === 'production') {
    BASE_URL = import.meta.env.VITE_RENDER_URL;
    if (!BASE_URL || !BASE_URL.startsWith('https://')) {
        console.error("Critical Error: VITE_RENDER_URL environment variable is not defined or is invalid in production.");
    }
} else {
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
            params: { type, gender }
        });
        console.log('Fetched Team Rankings:', response.data);
        const ranking = response.data.find(r => r.type === type.toUpperCase() && r.gender === gender.toLowerCase());
        return ranking ? ranking.teams.map(team => ({
            ...team,
            rating: ranking.rating || ranking.points || ranking.score || 'N/A'
        })).slice(0, 5) : [];
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
    try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: { filter: `starts_between:${today},${nextWeek};status:Fixture`, include: 'localteam,visitorteam,league' },
        });
        return response.data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
};

export const fetchNews = async (maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const startTime = performance.now();
            const response = await axios.get(`${BASE_URL}/news`, {
                timeout: 10000
            });
            const endTime = performance.now();
            console.log(`API call took ${Math.round(endTime - startTime)}ms`);
            console.log('Raw Response from /api/news:', response.data);

            if (!response.data || !Array.isArray(response.data)) {
                console.warn('Unexpected response structure or empty data:', response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error("Error fetching news:", error.message, error.code, error.config?.url);
            if (error.response && error.response.status === 429) {
                const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff: 1s, 2s, 4s
                console.warn(`Rate limit exceeded. Retrying in ${waitTime}ms... (Attempt ${retries + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
                continue;
            } else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BLOCKED_BY_CLIENT') {
                console.warn("Network error detected. Ensure the server is running.");
            } else if (error.code === 'ECONNABORTED') {
                console.warn('Request timed out. Check network or server.');
            }
            return [];
        }
    }
    console.warn('Max retries reached. Unable to fetch news.');
    return [];
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

export const fetchSeasons = async (maxRetries = 3) => {
    let retries = 0;
    const BASE_URL = import.meta.env.MODE === 'production' ? import.meta.env.VITE_RENDER_URL : 'http://localhost:3001/api';
    while (retries < maxRetries) {
        try {
            const startTime = performance.now();
            const response = await axios.get(`${BASE_URL}/seasons`, {
                params: {
                    api_token: import.meta.env.VITE_SPORTMONKS_API_TOKEN,
                    include: 'league', // Adjusted to match backend
                    sort: 'league_id,name'
                },
                timeout: 10000
            });
            const endTime = performance.now();
            console.log(`API call took ${Math.round(endTime - startTime)}ms`);
            console.log('Raw Response from /seasons:', response.data);

            if (!response.data || !Array.isArray(response.data.data)) {
                console.warn('Unexpected response structure or empty data:', response.data);
                return [];
            }
            return response.data.data;
        } catch (error) {
            console.error("Error fetching seasons:", error.message, error.code, error.config?.url);
            if (error.response && error.response.status === 429) {
                const waitTime = Math.pow(2, retries) * 1000;
                console.warn(`Rate limit exceeded. Retrying in ${waitTime}ms... (Attempt ${retries + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
                continue;
            } else if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BLOCKED_BY_CLIENT') {
                console.warn("Network error detected. Ensure the server is running.");
            } else if (error.code === 'ECONNABORTED') {
                console.warn('Request timed out. Check network or server.');
            }
            return [];
        }
    }
    console.warn('Max retries reached. Unable to fetch seasons.');
    return [];
};

export const fetchRecentMatches = async () => {
    try {
        const BASE_URL = import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_RENDER_URL
            : 'http://localhost:3001/api';

        const response = await axios.get(`${BASE_URL}/matches/recent`);
        console.log('Fetched recent matches:', response.data.length);
        return response.data;
    } catch (error) {
        console.error("Error fetching recent matches:", error.message);
        return [];
    }
};

export const fetchTopPlayers = async () => {
    try {
        const startTime = performance.now();
        const response = await axios.get(`${BASE_URL}/players/top`, {
            timeout: 15000
        });
        const endTime = performance.now();
        console.log(`API call took ${Math.round(endTime - startTime)}ms`);
        console.log('Raw Response:', response.data);

        if (!response.data || !Array.isArray(response.data.data)) {
            console.warn('Unexpected response structure or empty data:', response.data);
            return [];
        }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching top players:", error.message, error.code, error.config?.url);
        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_BLOCKED_BY_CLIENT') {
            console.warn("Network error detected. Ensure the backend URL is correct and accessible.");
        } else if (error.code === 'ECONNABORTED') {
            console.warn('Request timed out. Check backend availability.');
        }
        return [];
    }
};

// src/api.js
export const fetchICCRankings = async (format) => {
  try {
    const response = await axios.get(`${BASE_URL}/rankings/icc/${format}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ICC rankings:", error);
    return [];
  }
};
export const fetchCricketNews = async () => {
  try {
    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY || 'pub_acedfd3cbe3f45e2a55183787d8359de';
    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: API_KEY,
        country: 'in,us,gb',     // Top cricket nations
        language: 'en',
        category: 'sports',
        q: 'cricket',            // Search keyword
        size: 6                  // Number of articles
      },
      timeout: 10000
    });

    const articles = response.data.results || [];

    // Map to consistent format
    return articles.map(article => ({
      id: article.article_id || article.link,
      title: article.title || 'No title',
      description: article.description || article.content || 'No description available.',
      image: article.image_url || 'https://via.placeholder.com/600x400?text=No+Image',
      link: article.link,
      publishedAt: article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Unknown',
      source: article.source_id || 'Unknown Source'
    }));
  } catch (error) {
    console.error("Error fetching cricket news:", error.message);
    if (error.response) {
      console.error("News API Error:", error.response.status, error.response.data);
    }
    return [];
  }
};

export const fetchPastMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: { 'filter[status]': 'Finished', include: 'localteam,visitorteam,league' },
        });
        return response.data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
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
    try {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: {
                filter: `starts_between:${today},${nextWeek}`,
                include: 'manofseries,localteam,visitorteam,league',
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching fixtures:', error.message);
        throw error;
    }
};