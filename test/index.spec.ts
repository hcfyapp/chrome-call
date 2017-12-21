import chromeCall from '../src/index'
import { polyfill } from 'es6-promise'

polyfill()

// @ts-ignore
window.chrome = {
  runtime: {}
}

interface FakeObj {
  method: (this: FakeObj, key: string, cb: (...args: any[]) => any) => void
}

const fakeObj: FakeObj = {
  // tslint:disable-next-line:no-empty
  method() {}
}

describe('chromeCall', () => {
  beforeEach(() => {
    spyOn(fakeObj, 'method').and.callFake(function(key, cb) {
      expect(this).toBe(fakeObj)
      expect(key).toBe('a')
      expect(typeof cb).toBe('function')
      setTimeout(() => {
        cb('a', 'b')
      }, 100)
    } as FakeObj['method'])
  })

  it('若正常执行则 resolve promise', done => {
    chromeCall(fakeObj, 'method', ['a']).then(
      value => {
        expect(value).toBe('a')
        done()
      },
      () => {
        done.fail('没有进入 resolve 分支')
      }
    )
  })

  it('若执行时出错则会 reject promise', done => {
    chrome.runtime.lastError = new Error('hello error')
    chromeCall(fakeObj, 'method', 'a').then(
      () => {
        chrome.runtime.lastError = undefined
        done.fail('没有进入 reject 分支')
      },
      error => {
        expect(error.message).toBe('hello error')
        chrome.runtime.lastError = undefined
        done()
      }
    )
  })

  it('最后一个参数是 true，则返回一个数组', done => {
    chromeCall(fakeObj, 'method', ['a'], true).then(
      value => {
        expect(Array.isArray(value)).toBe(true)
        expect(value).toEqual(['a', 'b'])
        done()
      },
      () => {
        done.fail('没有进入 resolve 分支')
      }
    )
  })
})
