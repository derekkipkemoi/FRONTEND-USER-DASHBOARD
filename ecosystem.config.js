module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
