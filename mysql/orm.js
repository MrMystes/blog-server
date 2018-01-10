const orm = require('orm')
const qOrm = require('q-orm')
const config = require('./config.js').mysql.blog
const configStr = `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?${config.query}`

var connection = null



module.exports = async function (ctx, next) {
  if (connection) {
    await next();
  } else {             
    await qOrm.qConnect(configStr)
    .then(function (db) {
      connection = db;
      db.qDefine('article', {
        dbID: {
          type: 'serial',
          key: true
        },
        uniqueId: String,
        title: String,
        content: String,
        description: String,
        tag: String,
        createAt: String,
        lastUpdate: String,
        readCount: Number,
        status:Number
      });
      ctx.req.models = db.models;
      ctx.req.db = db;
    })
    .catch(err=>{

    })
    await next();
  }
};