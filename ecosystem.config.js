module.exports = {
  apps: [
    {
      name: 'base-nest-api',
      script: 'yarn',
      args: 'start:prod',
      interpreter: '/bin/bash',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
};
