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

const utils = {
  promisify:promisify
}
module.exports = utils