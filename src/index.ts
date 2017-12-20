export interface AnyFn {
  (...args: any[]): any
}

export default function<T extends object>(
  object: T,
  methodName: keyof T,
  args: any | any[] = [],
  returnArray?: boolean
): Promise<any> {
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
    ;(object[methodName] as AnyFn).apply(object, args)
  })
}
