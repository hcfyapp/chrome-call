interface A {
  [prop: string]: any
}

function chromeCall<T extends A>(
  object: T,
  methodName: keyof T,
  args: any | any[],
  returnArray: true
): Promise<any[]>
function chromeCall<T extends A>(
  object: T,
  methodName: keyof T,
  args: any | any[],
  returnArray?: boolean
): Promise<any>
function chromeCall<T extends A>(
  object: T,
  methodName: keyof T,
  args: any | any[] = [],
  returnArray?: boolean
) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(args)) {
      args = [args]
    }
    args.push((...results: any[]) => {
      const { lastError } = chrome.runtime
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
    ;(object[methodName] as Function).apply(object, args)
  })
}

export default chromeCall
