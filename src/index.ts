export interface FnObj {
  [prop: string]: (...args: any[]) => any
}

export default function<T extends FnObj>(
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
    object[methodName].apply(object, args)
  })
}
