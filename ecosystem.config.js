module.exports = {
    apps : [{
      name: "githook",
      script: "./src/server.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }],
    deploy: {
        production: {
            host: 'localhost',
            ref: 'origin/master',
            repo: 'https://github.com/jhfoo/githook.git',
            path: '/home/jhfoo/prod/githook',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production && chmod +x commit.sh',
            env: {
                NODE_ENV: 'production'
            }
        }
    }
  }