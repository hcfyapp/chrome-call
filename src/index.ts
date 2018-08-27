interface A {
  [prop: string]: any
}

function chromeCall<T extends A>(
  returnArray: true,
  object: T,
  methodName: keyof T,
  ...args: any[]
): Promise<any[]>
function chromeCall<T extends A>(
  returnArray: false,
  object: T,
  methodName: keyof T,
  ...args: any[]
): Promise<any>
function chromeCall<T extends A>(
  object: T,
  methodName: keyof T,
  ...args: any[]
): Promise<any>
function chromeCall<T extends A>(
  object: boolean | T,
  methodName: T | keyof T,
  ...args: any[]
) {
  let returnArray: boolean
  if (typeof object === 'boolean') {
    returnArray = object
    object = methodName as T
    methodName = args.shift() as keyof T
  }
  return new Promise((resolve, reject) => {
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
    // @ts-ignore
    object[methodName].apply(object, args)
  })
}

export default chromeCall
