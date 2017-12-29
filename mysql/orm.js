const orm = require('orm')
const qOrm = require('q-orm')
const config = require('./config.js')

var connection = null

module.exports = async function (ctx, next) {
  if (connection) {
    await next();
  } else {
    await qOrm.qConnect("mysql://Mystes:ntxytq007@106.14.205.89:3306/blog_database").then(function (db) {
      connection = db;
      db.qDefine('blog', {
        dbID: {
          type: 'serial',
          key: true
        },
        uniqueId: String,
        title: String,
        content: String,
        description: String,
        tag: String,
        createAt: Date,
        lastUpdate: Date,
        readCount: Number
      });
      ctx.req.models = db.models;
      ctx.req.db = db;
    });
    await next();
  }
};