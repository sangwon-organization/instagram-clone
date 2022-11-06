module.exports = {
  apps: [
    {
      name: 'instagram_clone',
      script: 'app.js',
      instances: 1,
      max_memory_restart: '300M',
      watch: ['.'],
      ignore_watch: ['public/images', 'node_modules'],
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
}
