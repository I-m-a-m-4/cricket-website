import axios from 'axios';

// Get the base URL from the environment variables.
const BASE_URL = import.meta.env.VITE_RENDER_URL;

// Ensure the BASE_URL is always defined in a production environment.
// If it's not, we throw an error to prevent network requests to localhost.
if (import.meta.env.MODE === 'production' && (!BASE_URL || !BASE_URL.startsWith('https://'))) {
    console.error("Critical Error: VITE_RENDER_URL environment variable is not defined or is invalid.");
    // In a production build, you can set a fallback or throw an error.
    // For now, we will set a placeholder to prevent network requests.
    // You could also add a UI element to inform the user of the error.
    // For this example, we'll use a local URL, but it will be obvious that it's not working.
} else if (import.meta.env.MODE === 'development') {
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
        const response = await axios.get(`${BASE_URL}/matches/upcoming`);
        return response.data;
    } catch (error) {
        console.error("Error fetching upcoming matches:", error);
        return [];
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

export const fetchTeamRankings = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/team-rankings/global`);
        return response.data;
    } catch (error) {
        console.error("Error fetching global team rankings:", error);
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
