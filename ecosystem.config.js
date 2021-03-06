module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'blogServer',
      script    : './bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },

    
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'root',
      host : 'www.ayuki.ink',
      ref  : 'origin/master',
      repo : 'git@github.com:MrMystes/blog-server.git',
      path : '/home/deploy/blog-server',
      'post-deploy' : 'npm install && npm link mysql && pm2 start ecosystem.config.js --env production'
    }
  }
};
