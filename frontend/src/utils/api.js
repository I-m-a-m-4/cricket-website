import axios from 'axios';

// Get the base URL from the environment variables.
let BASE_URL;
if (import.meta.env.MODE === 'production') {
    BASE_URL = import.meta.env.VITE_RENDER_URL;
    if (!BASE_URL || !BASE_URL.startsWith('https://')) {
        // Removed console.error
    }
} else {
    BASE_URL = 'http://localhost:3001/api';
}



export const fetchTeamRankings = async (type, gender) => {
    try {
        const response = await axios.get(`${BASE_URL}/team-rankings/global`, {
            params: { type, gender }
        });
        const ranking = response.data.find(r => r.type === type.toUpperCase() && r.gender === gender.toLowerCase());
        return ranking ? ranking.teams.map(team => ({
            ...team,
            rating: ranking.rating || ranking.points || ranking.score || 'N/A'
        })).slice(0, 5) : [];
    } catch (error) {
        // Removed console.error
        throw error;
    }
};

export const fetchAusIndMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/aus-ind`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

export const fetchLegendsLeagueMatches = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/matches/legends-league`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

// utils/api.js
export const fetchAllMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/matches`);
    // Map response to include innings if available
    return response.data.map(match => ({
      ...match,
      innings: match.innings || [], // Fallback to empty if not present
    }));
  } catch (error) {
    return [];
  }
};

// Similarly update other fetch functions (fetchLiveMatches, etc.)
export const fetchLiveMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/matches/live`);
    return response.data.map(match => ({
      ...match,
      innings: match.innings || [],
    }));
  } catch (error) {
    return [];
  }
};
// Repeat for fetchUpcomingMatches, fetchAusIndMatches, fetchLegendsLeagueMatches

export const fetchUpcomingMatches = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        filter: `starts_between:${today},${nextWeek}`,
        include: 'localteam,visitorteam,league',
      },
    });

    if (!response?.data?.data) {
      // Removed console.warn
      return [];
    }

    if (!Array.isArray(response.data.data)) {
      // Removed console.warn
      return [];
    }

    const upcomingMatches = response.data.data.filter(
      (match) => match.status === 'Fixture'
    );

    return upcomingMatches;
  } catch (error) {
    // Removed console.error
    return [];
  }
};

export const fetchNews = async (maxRetries = 3) => {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await axios.get(`${BASE_URL}/news`, {
                timeout: 10000
            });
            if (!response.data || !Array.isArray(response.data)) {
                // Removed console.warn
                return [];
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const waitTime = Math.pow(2, retries) * 1000;
                // Removed console.warn
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
                continue;
            }
            // Removed console.warn for network errors and timeout
            return [];
        }
    }
    // Removed console.warn
    return [];
};

export const fetchStandings = async (seasonId) => {
    try {
        const response = await axios.get(`${BASE_URL}/standings/${seasonId}`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

export const fetchSeasons = async (maxRetries = 3) => {
    let retries = 0;
    const BASE_URL = import.meta.env.MODE === 'production' ? import.meta.env.VITE_RENDER_URL : 'http://localhost:3001/api';
    while (retries < maxRetries) {
        try {
            const response = await axios.get(`${BASE_URL}/seasons`, {
                params: {
                    api_token: import.meta.env.VITE_SPORTMONKS_API_TOKEN,
                    include: 'league',
                    sort: 'league_id,name'
                },
                timeout: 10000
            });
            if (!response.data || !Array.isArray(response.data.data)) {
                // Removed console.warn
                return [];
            }
            return response.data.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                const waitTime = Math.pow(2, retries) * 1000;
                // Removed console.warn
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retries++;
                continue;
            }
            // Removed console.warn for network errors and timeout
            return [];
        }
    }
    // Removed console.warn
    return [];
};

export const fetchRecentMatches = async () => {
    try {
        const BASE_URL = import.meta.env.MODE === 'production'
            ? import.meta.env.VITE_RENDER_URL
            : 'http://localhost:3001/api';

        const response = await axios.get(`${BASE_URL}/matches/recent`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

export const fetchTopPlayers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/players/top`, {
            timeout: 15000
        });
        if (!response.data || !Array.isArray(response.data.data)) {
            // Removed console.warn
            return [];
        }
        return response.data.data;
    } catch (error) {
        // Removed console.error and console.warn
        return [];
    }
};

export const fetchICCRankings = async (format) => {
  try {
    const response = await axios.get(`${BASE_URL}/rankings/icc/${format}`);
    return response.data;
  } catch (error) {
    // Removed console.error
    return [];
  }
};

export const fetchCricketNews = async () => {
  try {
    const API_KEY = import.meta.env.VITE_NEWSAPI_KEY || 'pub_acedfd3cbe3f45e2a55183787d8359de';
    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: API_KEY,
        country: 'in,us,gb',
        language: 'en',
        category: 'sports',
        q: 'cricket',
        size: 6
      },
      timeout: 10000
    });

    const articles = response.data.results || [];

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
    // Removed console.error
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
        // Removed console.error
        throw error;
    }
};

export const fetchTeams = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/teams`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

export const fetchLeagues = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/leagues`);
        return response.data;
    } catch (error) {
        // Removed console.error
        return [];
    }
};

export const fetchVideos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/videos`);
        return response.data;
    } catch (error) {
        // Removed console.error
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
        // Removed console.error
        throw error;
    }
};

export const fetchTeamById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/${id}`);
    return response.data;
  } catch (error) {
    // Removed console.error
    throw error;
  }
};

export const fetchPlayerById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${id}`);
    return response.data;
  } catch (error) {
    // Removed console.error
    throw error;
  }
};
