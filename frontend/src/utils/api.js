import axios from 'axios';

// Get the environment variable from Vercel's build process.
// If it's not 'production', it will default to 'development'.
const isProduction = process.env.REACT_APP_VERCEL_ENV === 'production';

const BASE_URL = isProduction
  ? 'https://cricket-api.onrender.com/api'
  : 'http://localhost:3001/api';

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