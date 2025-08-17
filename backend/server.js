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

// GET Team by ID with players and officials
app.get('/api/teams/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid team ID' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/teams/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'players,players.profile,players.image,officials,venue,country'
      },
      timeout: 10000
    });

    const team = response.data.data;

    if (!team) {
      return res.status(404).json({ error: 'Team not found in SportMonks API' });
    }

    const players = (team.players?.data || []).map(p => ({
      id: p.id,
      name: p.name || 'Unknown Player',
      image: p.image?.url || `https://avatar.vercel.sh/${p.name || 'P'}.png?text=${(p.name || 'P').charAt(0)}`,
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
        econ: p.stats?.economy || 0
      }
    }));

    const officials = (team.officials?.data || []).map(o => ({
      id: o.id,
      name: o.name || 'Unknown Staff',
      role: o.position?.name || 'Staff',
      image: o.image?.url || `https://avatar.vercel.sh/${o.name || 'S'}.png?text=${(o.name || 'S').charAt(0)}`
    }));

    res.json({
      id: team.id,
      name: team.name || 'Unknown Team',
      code: team.code || '',
      image: team.image_path || `https://avatar.vercel.sh/${team.name || 'T'}.png?text=${(team.name || 'T').charAt(0)}`,
      country: team.country?.name || 'Unknown',
      founded: team.founded || 'Unknown',
      venue: team.venue?.name || 'Unknown Venue',
      city: team.venue?.city || 'Unknown City',
      website: team.website || '',
      description: team.description || `The ${team.name || 'team'} are a professional cricket team.`,
      players,
      officials
    });
  } catch (error) {
    console.error('Error fetching team:', error.message);
    if (error.response) {
      console.error('SportMonks API Error:', error.response.status, error.response.data);
      return res.status(error.response.status).json({
        error: 'Failed to fetch team',
        details: error.response.data.message || 'Unknown API error'
      });
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET Player by ID
app.get('/api/players/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/players/${id}`, {
      params: {
        api_token: API_TOKEN,
        include: 'profile,image,team,country,batting_style,bowling_style,position'
      }
    });

    const p = response.data.data;

    const player = {
      id: p.id,
      name: p.name,
      full_name: p.profile?.fullname || p.name,
      image: p.image?.url || `https://avatar.vercel.sh/${p.name}.png?text=${p.name.charAt(0)}`,
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
        five_wickets: p.stats?.five_wickets || 0
      }
    };

    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error.message);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// New endpoint for match details
app.get('/api/matches/:id', async (req, res) => {
    const { id } = req.params;

    // Validate ID
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

        res.json(match);
    } catch (error) {
        console.error('Error fetching match details for ID:', id, error.message);
        if (error.response) {
            console.error('API Response Status:', error.response.status);
            console.error('API Response Data:', error.response.data);
            return res.status(error.response.status).json({
                error: 'Failed to fetch match details',
                details: error.response.data.message || 'Unknown API error'
            });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});