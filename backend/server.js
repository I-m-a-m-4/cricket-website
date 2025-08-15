import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Check if the API tokens are set
if (!API_TOKEN) {
    console.error("SPORTMONKS_API_TOKEN is not set. Please add it to your .env file.");
    // This will exit the application if the token is missing, preventing 500 errors.
    process.exit(1); 
}

if (!YOUTUBE_API_KEY) {
    console.error("YOUTUBE_API_KEY is not set. Please add it to your .env file.");
    // Exit if YouTube API key is missing
    process.exit(1); 
}

app.use(cors());
app.use(express.json());

// Main endpoint to get all cricket matches with includes
app.get('/api/matches', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'include': 'localteam,visitorteam,league,venue,runs'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching all matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch all matches' });
    }
});

// Endpoint to get matches for "AUS vs IND"
app.get('/api/matches/aus-ind', async (req, res) => {
    try {
        const ausId = 1;
        const indId = 2;
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'filter[team_id]': `${ausId},${indId}`,
                'include': 'localteam,visitorteam,league,venue,runs'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching AUS vs IND matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

// Endpoint to get matches for "Legends League"
app.get('/api/matches/legends-league', async (req, res) => {
    try {
        const leagueId = 3;
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'filter[league_id]': leagueId,
                'include': 'localteam,visitorteam,league,venue,runs'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching Legends League matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch matches' });
    }
});

// Endpoint to get live matches
app.get('/api/matches/live', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/livescores`, {
            params: {
                api_token: API_TOKEN,
                'include': 'localteam,visitorteam,league,venue,runs'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching live matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch live matches' });
    }
});

// Endpoint to get upcoming matches
app.get('/api/matches/upcoming', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'filter[status]': 'Fixture',
                'include': 'localteam,visitorteam,league,venue,runs'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching upcoming matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch upcoming matches' });
    }
});

// Endpoint to get "news" articles from recent fixtures
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'filter[status]': 'Finished',
                'include': 'localteam,visitorteam,season,runs',
                'sort': '-starting_at'
            }
        });

        const articles = response.data.data.slice(0, 6).map(fixture => {
            const winner = fixture.winner_team_id === fixture.localteam?.id 
                ? fixture.localteam?.name 
                : fixture.visitorteam?.name;
            const localTeamScore = fixture.runs.find(run => run.team_id === fixture.localteam?.id);
            const visitorTeamScore = fixture.runs.find(run => run.team_id === fixture.visitorteam?.id);

            let description = `Match concluded.`;

            if (localTeamScore && visitorTeamScore) {
                description = `${fixture.localteam?.name} scored ${localTeamScore.score}/${localTeamScore.wickets} in ${localTeamScore.overs} overs. ${fixture.visitorteam?.name} scored ${visitorTeamScore.score}/${visitorTeamScore.wickets} in ${visitorTeamScore.overs} overs.`;
            } else if (localTeamScore) {
                description = `${fixture.localteam?.name} scored ${localTeamScore.score}/${localTeamScore.wickets} in ${localTeamScore.overs} overs.`;
            } else if (visitorTeamScore) {
                description = `${fixture.visitorteam?.name} scored ${visitorTeamScore.score}/${visitorTeamScore.wickets} in ${visitorTeamScore.overs} overs.`;
            }

            if (winner && localTeamScore && visitorTeamScore) {
                description += ` ${winner} won the match.`;
            }
            
            return {
                id: fixture.id,
                title: `${fixture.localteam?.name || 'Team A'} vs ${fixture.visitorteam?.name || 'Team B'} Match Report`,
                image: fixture.localteam?.image_path || `https://via.placeholder.com/600x400?text=Image+Not+Available`,
                description: description,
                link: `/match/${fixture.id}`,
                season: fixture.season
            };
        });

        res.json(articles);
    } catch (error) {
        console.error('Error fetching news articles:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
});

// New endpoint to get videos from YouTube
app.get('/api/videos', async (req, res) => {
    try {
        const query = 'cricket highlights';
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}&maxResults=8`;
        
        const response = await axios.get(youtubeApiUrl);
        
        // Format the YouTube API response to be cleaner for the front-end
        const formattedVideos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle
        }));

        res.json(formattedVideos);
    } catch (error) {
        console.error('Error fetching videos from YouTube:', error.message);
        if (error.response) {
            console.error('YouTube API Response Status:', error.response.status);
            console.error('YouTube API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

app.get('/api/fixtures', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                ...req.query // pass through query params from frontend
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching fixtures:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch fixtures' });
    }
});


// New endpoint to get standings for a specific season
app.get('/api/standings/:seasonId', async (req, res) => {
    try {
        const { seasonId } = req.params;
        const response = await axios.get(`${API_BASE_URL}/standings/season/${seasonId}`, {
            params: {
                api_token: API_TOKEN
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching standings:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
});

app.get('/api/players/top', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/players`, {
            params: {
                api_token: API_TOKEN,
                include: 'teams' // Changed from 'team' to 'teams'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching players:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch players' });
    }
});
// New endpoint to get a list of all teams
app.get('/api/teams', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/teams`, {
            params: {
                api_token: API_TOKEN
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching teams:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// New endpoint to get a list of all leagues
app.get('/api/leagues', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leagues`, {
            params: {
                api_token: API_TOKEN,
                'include': 'seasons'
            }
        });
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching leagues:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch leagues' });
    }
});

app.get('/api/team-rankings/global', async (req, res) => {
    try {
        const { type, gender } = req.query;
        const params = {
            api_token: API_TOKEN,
            include: 'teams'
        };
        if (type) params['filter[type]'] = type.toUpperCase(); // Use 'type' filter
        if (gender) params['filter[gender]'] = gender.toLowerCase();

        const response = await axios.get(`${API_BASE_URL}/team-rankings`, { params });
        // Filter to match the requested type and gender, then map to include teams
        const rankings = response.data.data
            .filter(r => !type || r.type === type.toUpperCase())
            .filter(r => !gender || r.gender === gender.toLowerCase())
            .map(ranking => ({
                ...ranking,
                teams: ranking.team || []
            }));
        res.json(rankings);
    } catch (error) {
        console.error('Error fetching global team rankings:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to fetch global team rankings' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
