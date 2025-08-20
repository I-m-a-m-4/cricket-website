module.exports = {
  apps: [
    {
      name: "cricket-website",
      script: "npm",
      args: "run dev",
      env: {
        PORT: 5175,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 5175,
        NODE_ENV: "production",
      },
    },
  ],
};