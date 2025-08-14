module.exports = {
  apps: [
    {
      name: "showmelove-waitlist",
      script: "npm",
      args: "run dev",
      env: {
        PORT: 4000,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 4000,
        NODE_ENV: "production",
      },
    },
  ],
};
