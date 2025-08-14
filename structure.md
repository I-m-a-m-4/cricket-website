
backend/
├── node_modules/         # Node.js dependencies
├── controllers/          # Business logic (e.g., fetching and formatting data)
│   └── cricketController.js
├── routes/               # API endpoints
│   └── cricketRoutes.js
├── services/             # API calls to Sportmonks
│   └── sportmonks.js
├── .env                  # Environment variables (for your API key)
├── server.js             # Main server file (Express.js setup)
└── package.json          # Project dependencies and scripts
Frontend (frontend/)

frontend/
├── node_modules/         # React dependencies
├── public/               # Static assets (HTML, images, etc.)
│   ├── index.html        # Main HTML file
│   └── favicon.ico
├── src/
│   ├── assets/           # Images, fonts, and other static assets
│   ├── components/       # Reusable UI components (e.g., PlayerCard, Scorecard)
│   │   ├── MatchDetails.js
│   │   ├── LiveScores.js
│   │   ├── PlayerProfile.js
│   │   ├── PointsTable.js
│   │   ├── Breadcrumbs.js
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── SearchBar.js
│   ├── pages/            # Page-level components
│   │   ├── HomePage.js
│   │   ├── MatchPage.js
│   │   ├── TeamPage.js
│   │   └── StandingsPage.js
│   ├── styles/           # Tailwind CSS configuration and custom styles
│   │   └── main.css
│   ├── utils/            # Helper functions (e.g., timezone adjuster, API calls)
│   │   └── api.js
│   ├── App.js            # Main application component
│   └── index.js          # Entry point for the React application
├── .env                  # Environment variables for the frontend
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Frontend dependencies and scripts