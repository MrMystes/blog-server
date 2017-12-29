const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const multer = require('koa-multer')
const upload = multer({
  dest: './public/tmp'
})

const md = require('../markdown/markdown.js')

router.prefix('/posts')

router.post('/', function (ctx, next) {
  const blog = ctx.req.models.blog
  const msg = ctx.request.body
  let createItem = promisify(blog.create,blog)
  await createItem([msg]).then(success=>{
    console.log(err)
  }).catch(err=>{
    console.log(err)
  })
  ctx.body = "123123"
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