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

    /* // Second application
    {
      name      : 'WEB',
      script    : 'web.js'
    } */
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'Mystes',
      host : '106.14.205.89',
      ref  : 'origin/master',
      repo : 'https://github.com/MrMystes/blog-server.git',
      path : '/home/deploy/blog-server',
      'post-deploy' : 'npm install & pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};
