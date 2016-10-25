# chrome call

[![Build Status](https://img.shields.io/travis/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://travis-ci.org/Selection-Translator/chrome-call)
[![Coverage Status](https://img.shields.io/coveralls/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://coveralls.io/github/Selection-Translator/chrome-call?branch=master)
[![dependencies Status](https://img.shields.io/david/Selection-Translator/chrome-call.svg?style=flat-square)](https://david-dm.org/Selection-Translator/chrome-call)
[![devDependencies Status](https://img.shields.io/david/dev/Selection-Translator/chrome-call.svg?style=flat-square)](https://david-dm.org/Selection-Translator/chrome-call#info=devDependencies)
[![NPM Version](https://img.shields.io/npm/v/chrome-call.svg?style=flat-square)](https://www.npmjs.com/package/chrome-call)

A really simple way to call the original chrome javascript API and return a Promise.

## Install

```
npm i -S chrome-call
```

## Usage

When you do:

```js
var promise = new Promise(function (resolve, reject) {
  chrome.storage.local.get('key', function (items) {
    if(chrome.runtime.lastError){
      reject(chrome.runtime.lastError)
    } else {
      resolve(items)
    }
  })
})
```

It's equal to:

```js
var promise = chromeCall('storage.local.get', 'key')
```

That's really simple, right?

### Multiple arguments in callback

Most of chrome API only has zero or one argument in callback, but someone not, such as [chrome.hid.receive](https://developer.chrome.com/apps/hid#method-receive).

In this situation, pass `true` as the first argument, then the value of promise will be an __real__ Array:

```js
chromeCall(true, 'hid.receive', connectionId)
  .then(function (args) {
    Array.isArray(args) // true
    var reportId = args[0]
    var data = args[1]
  })
```

### Scope

The global `chromeCall` search function on `window.chrome`, but you can use different scope:

```js
var local = chromeCall.scope('storage.local') // or chromeCall.scope(chrome.storage.local)
var promise = local('get', 'key')
```

## License

MIT
