const router = require('koa-router')()
const fs = require('fs')
const exec = require('child_process').exec;

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


module.exports = router
