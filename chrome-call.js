(function (root, factory) {
  /* istanbul ignore next */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else {
    root['chromeCall'] = factory()
  }
})(this, function () {
  'use strict'
  var runtime = chrome.runtime

  /**
   * 根据 base 对象返回指定路径的栈
   * @param {String} path - 属性路径，可用点（.）分隔
   * @param {Object} base - 开始查找的那个对象
   * @returns {*[]}
   *
   * @example
   *   pathStack('document.body',window) 应该返回 [window,window.document,window.document.body]
   */
  function pathStack (path, base) {
    var keys = path.split('.')
    var stack = [base]

    keys.forEach(function (key, i) {
      var val = stack[i][key]
      if (!val) {
        throw new Error('Cannot find "' + path + '".')
      }
      stack.push(val)
    })

    return stack
  }

  /**
   * 根据基础对象返回一个函数，此函数会以基础对象为起点寻找指定属性并调用
   * @param {String|Object} base
   * @returns {Function}
   */
  function scope (base) {
    var baseObj = typeof base === 'string' ? pathStack(base, chrome).pop() : base

    /**
     * 调用原本的 chrome api 并返回一个 Promise
     * @param {Boolean} [returnArray] - 当函数的第一个值是 true 时，则 Promise 会返回一个数组，包含 callback 的所有参数
     * @param {String} fnPath - 原本的 chrome api 的路径，相对于 chrome，如 storage.local.get
     * @returns {Promise}
     */
    return function (/* returnArray , fnPath , ...args */) {
      // inline copy arguments,
      // see https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
      var length = arguments.length
      var argumentsArray = []

      for (var i = 0; i < length; i += 1) {
        argumentsArray[i] = arguments[i]
      }

      var returnArray = argumentsArray.shift()
      var fnPath

      if (typeof returnArray === 'boolean') {
        fnPath = argumentsArray.shift()
      } else {
        fnPath = returnArray
        returnArray = false
      }

      // Step 1: find the function which need to be call
      var stack = pathStack(fnPath, baseObj)

      var args = argumentsArray
      return new Promise(function (resolve, reject) {
        // Step 2: inject callback
        args.push(function () {
          var lastError = runtime.lastError
          if (lastError) {
            reject(lastError)
            return
          }

          if (returnArray) {
            var length = arguments.length
            var argumentsArray = []

            for (var i = 0; i < length; i += 1) {
              argumentsArray[i] = arguments[i]
            }

            resolve(argumentsArray)
          } else {
            resolve(arguments[0])
          }
        })

        // Step 3: call function with it's original "this"
        stack.pop().apply(stack.pop(), args)
      })
    }
  }

  var defaultCp = scope(chrome)
  defaultCp.scope = scope
  return defaultCp
})
