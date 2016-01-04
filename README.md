# chrome call

[![Build Status](https://img.shields.io/travis/lmk123/chrome-call/master.svg?style=flat-square)](https://travis-ci.org/lmk123/chrome-call)
[![Coverage Status](https://img.shields.io/coveralls/lmk123/chrome-call/master.svg?style=flat-square)](https://coveralls.io/github/lmk123/chrome-call?branch=master)
[![dependencies Status](https://img.shields.io/david/lmk123/chrome-call.svg?style=flat-square)](https://david-dm.org/lmk123/chrome-call)
[![devDependencies Status](https://img.shields.io/david/dev/lmk123/chrome-call.svg?style=flat-square)](https://david-dm.org/lmk123/chrome-call#info=devDependencies)
[![NPM Version](https://img.shields.io/npm/v/chrome-call.svg?style=flat-square)](https://www.npmjs.com/package/chrome-call)

A really simple way to call the original chrome javascript API and return a Promise.

## Usage

When you do:

```js
var promise = new Promise(function(resolve,reject) {
  chrome.storage.local.get('key',function(value) {
    if(chrome.runtime.lastError){
      reject(chrome.runtime.lastError);
    }else{
      resolve(value);
    }
  });
});
```

Then with "chrome call":

```js
var promise = chromeCall('storage.local.get','key');
```

That's really simple, right?

### Scope

The default function `chromeCall` search function on `window.chrome`, but you can use different scope:

```js
var local = chromeCall.scope('storage.local'); // or chromeCall.scope(chrome.storage.local)
var promise = local('get','key');
```

## License

MIT
