module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'yarn',
      args: 'start',
      interpreter: 'bash',
      cwd: './', // Current directory where the command is executed
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
