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

router.use(async(ctx, next) => {
  if (!dbModel.get('article')) {
    dbModel.set('article', ctx.req.models.article)
    article = dbModel.get('article')
    article.removeAsync = promisify(article.remove, article)
    //article.saveAsync = promisify(article.save, article)
  }
  await next()
})

router.prefix('/posts')
//新增文章
router.post('/', async function (ctx, next) {
  const msg = ctx.request.body

  await article.qCreate([msg]).then(success => {
    console.log(success)
    ctx.status = 200
    ctx.message = 'Add New Article Success'
  }).catch(err => {
    console.log(err)
    ctx.status = 400
    ctx.message = 'failed'
  })

})

//将md转成html
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
      ctx.message = 'translate success'
      ctx.body = result
    })
    .catch(err => {
      console.log(err)
      ctx.status = 500
      ctx.message = 'error'
    })


})

//获取全部文章，支持query查询
router.get('/', async function (ctx, next) {
  let {
    offset,
    limit,
    status,
    fields
  } = ctx.query
  let condition={}, option = {}
  if (status!==undefined) {
    condition.status = parseInt(status)
  }
  option.limit = limit ? parseInt(limit) : null
  option.offset = offset ? parseInt(offset) : null
  option.fields = fields.split(',')

  await article.findAsync(condition, option)
    .then(result => {
      ctx.body = result
      ctx.status = 200
      ctx.message = 'Get Articles success'
    }).catch(err => {
      console.log(err)
    })
})
//获取文章总数
router.get('/count', async function (ctx, next) {
  await article.findAsync({}, {
      only: ['uniqueId']
    })
    .then(result => {
      ctx.body = result.length
      ctx.status = 200
      ctx.message = 'Get Count Success'
    }).catch(err => {
      console.log(err)
    })
});
//根据id获取文章信息
router.get('/:id', async function (ctx, next) {
  let uniqueId = ctx.params.id || ''
  await article.findAsync({
      uniqueId: uniqueId
    })
    .then(result => {
      ctx.status = 200
      ctx.message = 'Get Article Success'
      ctx.body = result[0]
    })
    .catch(err => {
      console.log(err)
      ctx.status = 404
      ctx.message = err
    })
})
//根据id修改文章信息
router.put('/:id', async function (ctx, next) {
  let uniqueId = ctx.params.id || ''
  const msg = ctx.request.body
  await article.find({uniqueId:uniqueId})
  .then(result=>{
    for(let key in msg){
      if(result.hasOwnProperty(key)){
        result[key] = msg[key]
      }
    }
    result.lastUpdate = String((new Date()).getTime())
    let save = promisify(result.save)
    return save()
  })
  .then(_=>{
    ctx.status = 200
    ctx.message = 'Modify Success'
  })
  .catch(err=>{
    ctx.status = 403
    ctx.message = 'Modify Failed'
  })
})

//根据id删除文章
router.delete('/:id', async function (ctx, next) {

  let uniqueId = ctx.params.id || ''
  await article.find({
      uniqueId: uniqueId
    }).removeAsync()
    .then(_ => {
      ctx.status = 200
      ctx.message = 'OK'
    }).catch(err => {
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