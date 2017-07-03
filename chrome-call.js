const { runtime } = chrome

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
  const keys = path.split('.')
  const stack = [base]

  keys.forEach((key, i) => {
    const val = stack[i][key]
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
  const baseObj = typeof base === 'string' ? pathStack(base, chrome).pop() : base

  /**
   * 调用原本的 chrome api 并返回一个 Promise
   * @param {Boolean} [returnArray] - 当函数的第一个值是 true 时，则 Promise 会返回一个数组，包含 callback 的所有参数
   * @param {String} fnPath - 原本的 chrome api 的路径，相对于 chrome，如 storage.local.get
   * @returns {Promise}
   */
  return function (...args) {
    let returnArray = args.shift()
    let fnPath

    if (typeof returnArray === 'boolean') {
      fnPath = args.shift()
    } else {
      fnPath = returnArray
      returnArray = false
    }

    // Step 1: find the function which need to be call
    const stack = pathStack(fnPath, baseObj)

    return new Promise((resolve, reject) => {
      // Step 2: inject callback
      args.push((...results) => {
        const { lastError } = runtime
        if (lastError) {
          reject(lastError)
          return
        }

        if (returnArray) {
          resolve(results)
        } else {
          resolve(results[0])
        }
      })

      // Step 3: call function with it's original "this"
      stack.pop().apply(stack.pop(), args)
    })
  }
}

const call = scope(chrome)

export { scope, call }
