const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const multer = require('koa-multer')
const dbModel = new Map()
let article = null
const upload = multer({
  dest: './public/tmp'
})

const md = require('../markdown/markdown.js')

router.use(async (ctx,next)=>{
  if (!dbModel.get('article')) {
    dbModel.set('article', ctx.req.models.article)
    article = dbModel.get('article')
    article.removeAsync = promisify(article.remove,article)
  }
  await next()
})

router.prefix('/posts')

router.post('/', async function (ctx, next) {
  const msg = ctx.request.body

  await article.qCreate([msg]).then(success => {
    console.log(success)
    ctx.status = 200
    ctx.message = 'OK'
  }).catch(err => {
    console.log(err)
    ctx.status = 400
    ctx.message = 'false'
  })

})
router.post('/md2html', upload.single('file'), async function (ctx, next) {
  const file = ctx.req.file;
  let readFile = promisify(fs.readFile, fs)
  let rename = promisify(fs.rename, fs)
  let newPath = path.join('./public/', file.originalname)
  await rename(file.path, newPath)
    .then(_ => {
      return readFile(newPath, 'utf-8')
    })
    .then(data => {
      let result = md.render(data)
      ctx.status = 200
      ctx.message = 'OK'
      ctx.body = result
    })
    .catch(err => {
      console.log(err)
      ctx.status = 500
      ctx.message = 'error'
    })


})


router.get('/', async function (ctx, next) {
  const {offset,limit,fields} = ctx.query 
  await article.findAsync({},{limit:parseInt(limit),offset:parseInt(offset),only:fields.split(',')})
    .then(result => {
      ctx.body = result
      ctx.status = 200
      ctx.message = 'OK'
    }).catch(err => {
      console.log(err)
    })
})

router.get('/id', async function (ctx, next) {
  await article.findAsync({},{
    only:['uniqueId']
  })
    .then(result => {
      ctx.body = result.map(item=>{
        return item.uniqueId
      })
      ctx.status = 200
      ctx.message = 'OK'
    }).catch(err => {
      console.log(err)
    })
});

router.delete('/id/:id', async function (ctx, next) {
 
  let uniqueId = ctx.params.id || ''
  await article.find({uniqueId: uniqueId}).removeAsync()
    .then(_ => {
      ctx.status = 200
      ctx.message = 'OK'
    }).catch(err=>{
      ctx.status = 404
      ctx.message = err
    })
})






function promisify(fn, receiver) {
  return function () {
    let _len = arguments.length
    let _args = [...arguments]

    return new Promise((resolve, reject) => {
      fn.apply(receiver, [].concat(_args, [function (err, data) {
        if (err) {
          reject(err)
        }
        resolve(data)
      }]))
    })
  }

}




module.exports = router