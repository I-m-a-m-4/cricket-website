import express from 'express';
import axios from 'axios';
import cors from 'cors';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const GNEWS_API_URL = 'https://gnews.io/api/v4';
const GNEWS_API_TOKEN = '3b72535cbf2edd337a6820664589e55b';



const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour 

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
// Check if the API tokens are set
if (!API_TOKEN) {
    console.error("SPORTMONKS_API_TOKEN is not set. Please add it to your .env file.");
    process.exit(1); 
}

if (!YOUTUBE_API_KEY) {
    console.error("YOUTUBE_API_KEY is not set. Please add it to your .env file.");
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

// Endpoint to get rankings for ICC formats
app.get('/api/rankings/icc/:format', async (req, res) => {
  const { format } = req.params;
  const validFormats = ['test', 'odi', 't20i'];
  
  if (!validFormats.includes(format)) {
    return res.status(400).json({ error: 'Invalid format. Use: test, odi, t20i' });
  }

  try {
    const url = `https://www.icc-cricket.com/rankings/mens/team-rankings/${format}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CricketApp/1.0)'
      }
    });

    // Regex to extract data
    const regex = /<tr[^>]*>[\s\S]*?<td[^>]*>(\d+)<\/td>[\s\S]*?<img[^>]+alt="([^"]+)"[^>]*>[\s\S]*?<a[^>]+>([^<]+)<\/a>[\s\S]*?<td[^>]*>([\d.]+)<\/td>/g;
    const html = response.data;
    const rankings = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      const [, rank, flagCode, teamName, points] = match;
      rankings.push({
        rank: parseInt(rank, 10),
        name: teamName.trim(),
        code: flagCode.trim(),
        points: parseFloat(points),
        image: `https://images.sportmonks.com/flags/${flagCode.toLowerCase()}.png`
      });
    }

    if (rankings.length === 0) {
      return res.status(500).json({ error: 'No teams found in HTML' });
    }

    res.json(rankings);
  } catch (error) {
    console.error('ICC Rankings Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch ICC rankings' });
  }
});

// Endpoint to get recent matches
app.get('/api/matches/recent', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fixtures`, {
            params: {
                api_token: API_TOKEN,
                'filter[status]': 'Finished',
                include: 'localteam,visitorteam,league,venue,runs',
                sort: '-starting_at'
            },
            timeout: 10000
        });
        res.json(response.data.data.slice(0, 5));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent matches' });
    }
});

// Endpoint to get live matches
app.get('/api/matches/live', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/livescores`, {
            params: {
                api_token: API_TOKEN,
                include: 'localteam,visitorteam,league,venue,runs,batting,bowling,scoreboards,balls,firstumpire,secondumpire,tvumpire,manofmatch'
            },
            timeout: 10000
        });

        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching live matches:', error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
            return res.status(error.response.status).json({
                error: 'Failed to fetch live matches',
                details: error.response.data.message?.message || 'Invalid include or API error'
            });
        }
        res.status(500).json({ error: 'Internal server error' });
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

// Endpoint to get seasons
app.get('/api/seasons', async (req, res) => {
    const API_BASE_URL = 'https://cricket.sportmonks.com/api/v2.0';
    const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

    try {
        const url = new URL(`${API_BASE_URL}/seasons`);
        url.searchParams.append('api_token', API_TOKEN);
        url.searchParams.append('include', 'league');
        url.searchParams.append('sort', 'league_id,name');

        console.log('🎯 Requesting:', url.toString());

        const response = await axios.get(url.toString(), {
            timeout: 10000
        });

        if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
            return res.status(500).json({
                error: 'Invalid response from SportMonks',
                details: 'Missing or malformed data'
            });
        }

        res.json(response.data);

    } catch (error) {
        console.error('❌ Full Error:', error.message);

        if (error.response) {
            console.error('👉 API Response:', error.response.status, error.response.data);
            return res.status(error.response.status).json({
                error: 'SportMonks API error',
                details: error.response.data.message?.message || 'Unknown error'
            });
        }

        if (error.code === 'EPROTO' || error.code === 'ERR_SSL') {
            return res.status(500).json({
                error: 'SSL/TLS handshake failed',
                details: 'Check Node.js version or network firewall'
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
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

// Endpoint to get YouTube videos
app.get('/api/videos', async (req, res) => {
  console.log('Received request for /api/videos');
  try {
    const query = 'cricket highlights';
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}&maxResults=8`;
    console.log('YouTube API URL:', youtubeApiUrl);

    const response = await axios.get(youtubeApiUrl);
    console.log('YouTube API Response:', response.data);

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

// Endpoint to get fixtures
app.get('/api/fixtures', async (req, res) => {
  console.log('Received request for /api/fixtures');
  try {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

    console.log('API Token:', process.env.SPORTMONKS_API_TOKEN);
    const response = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: {
        api_token: process.env.SPORTMONKS_API_TOKEN,
        filter: `starts_between:${today},${nextWeek};status:Fixture`,
        include: 'localteam,visitorteam,league',
        ...req.query,
      },
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response format from API');
    }

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching fixtures:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
    } else {
      console.error('Non-API error:', error);
    }
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// Endpoint to get standings for a specific season
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

// Endpoint to get top players
app.get('/api/players/top', async (req, res) => {
  try {
    const startTime = performance.now();
    const response = await axios.get(`${API_BASE_URL}/players`, {
      params: {
        api_token: API_TOKEN,
        include: 'teams,position,country',
        order: 'updated_at:desc',
        per_page: 10, // Limit to 10 players
      },
      timeout: 10000,
    });
    const endTime = performance.now();
    console.log(`Sportmonks API call took ${Math.round(endTime - startTime)}ms`);
    console.log('Raw Players Response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid or empty response from Sportmonks:', response.data);
      return res.json([]);
    }

    // Format player data for frontend
    const topPlayers = response.data.data.map(player => ({
      id: player.id,
      fullname: player.fullname || 'Unknown Player',
      image_path: player.image_path || `https://placehold.co/200x200?text=${player.fullname?.[0] || 'P'}`,
      position: player.position?.name || 'Unknown',
      team: player.teams?.data?.[0]?.name || 'Unknown Team',
      country: player.country?.name || 'Unknown',
      country_flag: player.country?.image_path || `https://placehold.co/20x20?text=?`,
    }));

    res.json(topPlayers);
  } catch (error) {
    console.error('Error fetching top players:', error.message, error.code);
    console.error('Full Error Object:', JSON.stringify(error, null, 2));
    if (error.code === 'ECONNABORTED') {
      console.warn('Sportmonks API request timed out. Check API status or increase timeout.');
      return res.status(504).json({ error: 'Request timed out', details: 'Sportmonks API took too long to respond' });
    }
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      if (error.response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded', details: 'Too many requests to Sportmonks API' });
      }
      if (error.response.status === 401) {
        return res.status(401).json({ error: 'Authentication failed', details: 'Invalid or expired API token' });
      }
      return res.status(error.response.status).json({
        error: 'Failed to fetch top players',
        details: error.response.data.message || 'Unknown API error',
      });
    }
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Endpoint to get a list of all teams
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

// Endpoint to get a list of all leagues
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

// Endpoint to get global team rankings
app.get('/api/team-rankings/global', async (req, res) => {
  try {
    const { type, gender } = req.query;
    const params = {
      api_token: API_TOKEN,
      include: 'teams'
    };
    if (type) params['filter[type]'] = type.toUpperCase();
    if (gender) params['filter[gender]'] = gender.toLowerCase();

    const response = await axios.get(`${API_BASE_URL}/team-rankings`, { params });
    console.log('Raw Team Rankings Response:', response.data);

    const rankings = response.data.data
      .filter(r => !type || r.type === type.toUpperCase())
      .filter(r => !gender || r.gender === gender.toLowerCase())
      .map(ranking => ({
        ...ranking,
        teams: ranking.team || [],
        rating: ranking.rating || ranking.points || ranking.score || 0
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


// GET All Teams
app.get('/api/teams', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/teams`, {
      params: {
        api_token: API_TOKEN,
        include: 'country,image',
      },
      timeout: 10000,
    });

    console.log('SportMonks /teams response:', response.data); // Debug

    const teams = response.data.data.map((team) => ({
      id: team.id,
      name: team.name || 'Unknown Team',
      code: team.code || '',
      image: team.image_path || team.image?.url || null,
      country: team.country?.name || 'Unknown',
    }));

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    if (error.response) {
      console.error('SportMonks API Error:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        error: 'Failed to fetch teams',
        details: error.response.data.message || 'Unknown API error',
      });
    } else {
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }
});
// ... (previous imports and setup remain unchanged)
app.get('/api/teams/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const teamResponse = await axios.get(`${API_BASE_URL}/teams/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'country,squad,fixtures,results', // Valid includes
      },
      timeout: 10000,
    });

    const team = teamResponse.data.data;

    if (!team) {
      return res.status(404).json({ error: 'Team not found in SportMonks API' });
    }

    // Fetch venue separately if venue_id is available
    let venue = {};
    if (team.venue_id) {
      const venueResponse = await axios.get(`${API_BASE_URL}/venues/${team.venue_id}`, {
        params: {
          api_token: API_TOKEN,
        },
        timeout: 10000,
      });
      venue = venueResponse.data.data || {};
    }

    const players = (team.squad?.data || []).map((p) => ({
      id: p.id,
      name: p.name || 'Unknown Player',
      image: p.image_path || null,
      position: p.position?.name || 'Player',
      batting_style: p.batting_style?.name || 'Unknown',
      bowling_style: p.bowling_style?.name || 'Unknown',
      role: p.type || 'Player',
      country: p.country?.name || 'Unknown',
      date_of_birth: p.date_of_birth || null,
      height: p.height || null,
      weight: p.weight || null,
      career_stats: {
        matches: p.stats?.matches || 0,
        runs: p.stats?.runs || 0,
        wickets: p.stats?.wickets || 0,
        avg: p.stats?.average || 0,
        sr: p.stats?.strike_rate || 0,
        econ: p.stats?.economy || 0,
      },
    }));

    const officials = []; // Officials not supported; keep empty

    const now = new Date();
    const recentMatches = (team.results?.data || []).map((m) => ({
      id: m.id,
      vs: m.localteam_id === parseInt(id) ? m.visitorteam?.name : m.localteam?.name,
      league: m.league?.name || 'Unknown',
      result:
        m.winner_team_id === parseInt(id)
          ? 'Won'
          : m.winner_team_id
          ? 'Lost'
          : m.draw_noresult
          ? 'Draw'
          : 'No Result',
      date: m.starting_at
        ? new Date(m.starting_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBD',
    }));

    const upcoming = (team.fixtures?.data || []).map((u) => ({
      id: u.id,
      vs: u.localteam_id === parseInt(id) ? u.visitorteam?.name : u.localteam?.name,
      league: u.league?.name || 'Unknown',
      venue: u.venue?.name || 'Unknown',
      date: u.starting_at
        ? new Date(u.starting_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBD',
      time: u.starting_at
        ? new Date(u.starting_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : 'TBD',
    }));

    res.json({
      id: team.id,
      name: team.name || 'Unknown Team',
      code: team.code || '',
      image: team.image_path || null,
      country: team.country?.name || 'Unknown',
      founded: team.founded || 'N/A',
      venue: {
        name: venue.name || 'Unknown Venue',
        city: venue.city || 'Unknown City',
        image: venue.image_path || null,
        description: venue.description || 'No description available.',
      },
      website: team.website || '',
      description: team.description || `The ${team.name || 'team'} are a professional cricket team based in ${venue.city || 'Unknown'}.`,
      players,
      officials,
      recentMatches,
      upcoming,
    });
  } catch (error) {
    console.error('Error fetching team:', error.message);
    if (error.response) {
      console.error('SportMonks API Error:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        error: 'Failed to fetch team',
        details: error.response.data.message || 'Unknown API error',
      });
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// ... (rest of server.js remains the same)
// ... (rest of the server.js remains unchanged)
// GET Player by ID
app.get('/api/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/players/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'profile,image,team,country,batting_style,bowling_style,position',
      },
      timeout: 10000,
    });

    console.log('SportMonks /players/:id response:', response.data); // Debug

    const p = response.data.data;

    const player = {
      id: p.id,
      name: p.name,
      full_name: p.profile?.fullname || p.name,
      image: p.image?.url || p.image_path || null,
      team: p.team?.name,
      country: p.country?.name,
      role: p.position?.name || p.type || 'Player',
      batting_style: p.batting_style?.name || 'Unknown',
      bowling_style: p.bowling_style?.name || 'Unknown',
      date_of_birth: p.date_of_birth,
      height: p.height,
      weight: p.weight,
      debut: p.profile?.debut,
      birth_place: p.profile?.birth_place,
      nickname: p.profile?.nickname || null,
      description: p.profile?.information || `A talented ${p.position?.name || 'player'} from ${p.country?.name}.`,
      stats: {
        matches: p.stats?.matches || 0,
        runs: p.stats?.runs || 0,
        wickets: p.stats?.wickets || 0,
        avg: p.stats?.average || 0,
        sr: p.stats?.strike_rate || 0,
        econ: p.stats?.economy || 0,
        fifties: p.stats?.fifties || 0,
        hundreds: p.stats?.hundreds || 0,
        four_wickets: p.stats?.four_wickets || 0,
        five_wickets: p.stats?.five_wickets || 0,
      },
    };

    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error.message);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});


// Fallback articles
const FALLBACK_ARTICLES = [
  {
    title: 'Cricket News Fallback',
    description: 'Latest cricket updates unavailable. Check back soon!',
    content: 'Latest cricket updates unavailable. Check back soon!',
    url: '#',
    image: '/icc.jpg',
    publishedAt: new Date().toISOString(),
    source: 'Cricket App',
  },
];
// Top Headlines Endpoint
app.get('/api/news/top-headlines', async (req, res) => {
  try {
    const { lang = 'en', country = '', q = 'cricket', max = 10 } = req.query;
    const cacheKey = `top_headlines_${lang}_${country}_${q}_${max}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: { q, lang, country, max, token: GNEWS_API_TOKEN },
      timeout: 10000,
    });
    const data = {
      totalArticles: response.data.totalArticles,
      articles: response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source.name,
      })),
    };
    cache.set(cacheKey, data, 3600);
    res.json(data);
  } catch (error) {
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded', retryAfter: error.response.headers['retry-after'] || 60 });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API token' });
    } else {
      res.status(500).json({ error: 'Failed to fetch news', fallback: [] });
    }
  }
});

// News Search Endpoint
app.get('/api/news', async (req, res) => {
  try {
    const { q, lang = 'en', max = 10, url, slug } = req.query;
    const cacheKey = slug ? `news_${slug}` : url ? `news_${url}` : `news_${q}_${lang}_${max}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    let searchQuery = q || 'cricket';
    if (url) {
      const urlParts = url.split('/').filter(part => part);
      const titleSlug = urlParts[urlParts.length - 1].replace(/.html$/, '').replace(/-/g, ' ');
      searchQuery = `${titleSlug} site:${new URL(url).hostname}`; // Add site: filter for better matching
    } else if (slug) {
      searchQuery = `${slug} cricket`; // Use slug as part of the query
    }
    const response = await axios.get(`${GNEWS_API_URL}/search`, {
      params: { q: searchQuery, lang, max, token: GNEWS_API_TOKEN },
      timeout: 10000,
    });
    let articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source.name,
      slug: article.url.split('/').pop().replace(/.html$/, '').replace(/-/g, ' '),
    }));
    if (url) {
      const exactMatch = articles.find((article) => article.url === url);
      if (exactMatch) {
        articles = [exactMatch]; // Return only exact match if found
      } else {
        // Fallback to best match by title similarity
        articles = [articles.reduce((best, current) => {
          const bestScore = similarity(url.split('/').pop(), best.title.split(' ').pop());
          const currentScore = similarity(url.split('/').pop(), current.title.split(' ').pop());
          return currentScore > bestScore ? current : best;
        }, articles[0])];
      }
    } else if (slug) {
      const slugMatch = articles.find((article) => article.slug === slug);
      if (slugMatch) {
        articles = [slugMatch];
      } else {
        articles = [articles.reduce((best, current) => {
          const bestScore = similarity(slug, best.title.split(' ').pop());
          const currentScore = similarity(slug, current.title.split(' ').pop());
          return currentScore > bestScore ? current : best;
        }, articles[0])];
      }
    }
    if (articles.length === 0 || !articles[0].url) {
      return res.status(404).json({ error: 'Article not found', articles: [] });
    }
    const data = {
      totalArticles: url || slug ? articles.length : response.data.totalArticles,
      articles,
    };
    cache.set(cacheKey, data, 3600);
    res.json(data);
  } catch (error) {
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded', retryAfter: error.response.headers['retry-after'] || 60 });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API token' });
    } else {
      res.status(500).json({ error: 'Failed to fetch news', fallback: FALLBACK_ARTICLES });
    }
  }
});

// [Remaining endpoints remain unchanged...]

function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

// In server.js, update the /api/matches/:id endpoint
app.get('/api/matches/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    console.error('Invalid match ID:', id);
    return res.status(400).json({ error: 'Invalid match ID' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/fixtures/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'localteam,visitorteam,league,venue,runs,scoreboards,balls,lineup',
      },
      timeout: 10000,
    });

    const match = response.data.data;

    if (!match) {
      console.warn('Match not found for ID:', id);
      return res.status(404).json({ error: 'Match not found' });
    }

    // Enhance match data to include up to 4 innings
    const innings = [];
    const runs = match.runs || [];
    const teams = [
      match.localteam,
      match.visitorteam,
      // Add hypothetical teams if extending for 4-team format
      { id: 3, name: 'Team C', code: 'TC' }, // Mock
      { id: 4, name: 'Team D', code: 'TD' }, // Mock
    ].slice(0, 4); // Limit to 4

    teams.forEach((team, index) => {
      const teamRuns = runs.find(r => r.team_id === team.id) || { score: 0, wickets: 0, overs: 0 };
      innings.push({
        team: team.name,
        score: `${teamRuns.score || 0}/${teamRuns.wickets || 0}`,
        overs: teamRuns.overs || 0,
        inning: index + 1,
      });
    });

    res.json({
      ...match,
      innings, // Add innings array
    });
  } catch (error) {
    console.error('Error fetching match details for ID:', id, error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      return res.status(error.response.status).json({
        error: 'Failed to fetch match details',
        details: error.response.data.message || 'Unknown API error',
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/countries', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/countries`, {
      params: {
        api_token: API_TOKEN,
      },
      timeout: 10000,
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

app.get('/api/venues', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/venues`, {
      params: {
        api_token: API_TOKEN,
      },
      timeout: 10000,
    });
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

app.get('/api/venues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const venueResponse = await axios.get(`${API_BASE_URL}/venues/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'country', // Include country data
      },
      timeout: 10000,
    });
    const venue = venueResponse.data.data;
    if (venue) {
      // Add country_name to the response
      res.json({
        ...venue,
        country_name: venue.country?.name || 'N/A',
      });
    } else {
      res.status(404).json({ error: 'Venue not found' });
    }
  } catch (error) {
    console.error('Error fetching venue:', error.message);
    res.status(500).json({ error: 'Failed to fetch venue details' });
  }
});

app.get('/api/venues/trending', async (req, res) => {
  try {
    // Fetch recent matches
    const matchesResponse = await axios.get(`${API_BASE_URL}/fixtures`, {
      params: {
        api_token: API_TOKEN,
        'filter[status]': 'Finished',
        include: 'venue',
        sort: '-starting_at',
        per_page: 50, // Get recent matches
      },
      timeout: 10000,
    });
    // Count venue occurrences in recent matches
    const venueCount = {};
    matchesResponse.data.data.forEach(match => {
      if (match.venue) {
        venueCount[match.venue.id] = (venueCount[match.venue.id] || 0) + 1;
      }
    });
    // Fetch all venues
    const venuesResponse = await axios.get(`${API_BASE_URL}/venues`, {
      params: {
        api_token: API_TOKEN,
        include: 'country',
      },
      timeout: 10000,
    });
    // Sort venues by match count
    const trending = venuesResponse.data.data
      .map(venue => ({
        ...venue,
        country_name: venue.country?.name || 'N/A',
        match_count: venueCount[venue.id] || 0,
      }))
      .sort((a, b) => b.match_count - a.match_count)
      .slice(0, 5); // Top 5
    res.json(trending);
  } catch (error) {
    console.error('Error fetching trending venues:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending venues' });
  }
});

app.get('/api/news/trending', async (req, res) => {
  try {
    const { lang = 'en', country = '', max = 5 } = req.query;
    const cacheKey = `trending_news_${lang}_${country}_${max}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Fetch trending news from GNews API
    const response = await axios.get(`${GNEWS_API_URL}/search`, {
      params: {
        q: 'cricket trending',
        lang,
        country,
        max,
        token: GNEWS_API_TOKEN,
      },
      timeout: 10000,
    });

    let articles = response.data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));

    // If fewer than 5 articles, supplement with recent match-based articles
    if (articles.length < 5) {
      try {
        const matchResponse = await axios.get(`${API_BASE_URL}/fixtures`, {
          params: {
            api_token: API_TOKEN,
            'filter[status]': 'Finished',
            include: 'localteam,visitorteam,season,runs',
            sort: '-starting_at',
          },
          timeout: 10000,
        });

        const matchArticles = matchResponse.data.data.slice(0, 5 - articles.length).map(fixture => {
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
            title: `${fixture.localteam?.name || 'Team A'} vs ${fixture.visitorteam?.name || 'Team B'} Match Report`,
            description,
            content: description,
            url: `/match/${fixture.id}`,
            image: fixture.localteam?.image_path || 'https://via.placeholder.com/600x400?text=Match+Image',
            publishedAt: fixture.starting_at || new Date().toISOString(),
            source: 'Cricket App',
          };
        });

        articles = [...articles, ...matchArticles];
      } catch (matchError) {
        console.warn('Failed to fetch match-based articles:', matchError.message);
      }
    }

    // If still fewer than 5 articles, use fallback articles
    if (articles.length < 5) {
      const fallback = FALLBACK_ARTICLES.slice(0, 5 - articles.length).map((article, index) => ({
        ...article,
        title: `${article.title} ${index + 1}`,
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(), // Spread dates
      }));
      articles = [...articles, ...fallback];
    }

    const data = {
      totalArticles: articles.length,
      articles: articles.slice(0, 5), // Ensure exactly 5 articles
    };

    cache.set(cacheKey, data, 3600);
    res.json(data);
  } catch (error) {
    console.error('Error fetching trending news:', error.message);
    if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded', retryAfter: error.response.headers['retry-after'] || 60 });
    } else if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API token' });
    } else {
      // Return fallback articles in case of error
      const fallback = FALLBACK_ARTICLES.slice(0, 5).map((article, index) => ({
        ...article,
        title: `${article.title} ${index + 1}`,
        publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
      }));
      res.status(500).json({
        error: 'Failed to fetch trending news',
        articles: fallback,
      });
    }
  }
});

// Add to server.js
app.get('/api/stages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/stages/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'fixtures,runs,standings',
      },
    });
    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching stages:', error.message);
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});