# chrome-call

[![Build Status](https://img.shields.io/travis/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://travis-ci.org/Selection-Translator/chrome-call)
[![Coverage Status](https://img.shields.io/coveralls/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://coveralls.io/github/Selection-Translator/chrome-call?branch=master)
[![dependencies Status](https://img.shields.io/david/Selection-Translator/chrome-call.svg?style=flat-square)](https://david-dm.org/Selection-Translator/chrome-call)
[![devDependencies Status](https://img.shields.io/david/dev/Selection-Translator/chrome-call.svg?style=flat-square)](https://david-dm.org/Selection-Translator/chrome-call?type=dev)
[![NPM Version](https://img.shields.io/npm/v/chrome-call.svg?style=flat-square)](https://www.npmjs.com/package/chrome-call)

Call the original chrome javascript API and return a Promise.

## Install

### Use with Webpack

If you build your project with webpack, then you can install chrome-call from npm:

```
npm install chrome-call
```

then you can import it in your project:

```js
// es6 
import { call, scope } from 'chrome-call'

// commonjs
const { call, scope } = require('chrome-call')
```

### Use with &lt;script&gt;

Download chrome-call.js from [unpkg](https://unpkg.com/chrome-call)([min version](https://unpkg.com/chrome-call/dist/chrome-call.min.js)), then reference it in your html:

```html
<script src="path/to/chrome-call.js"></script>
<!-- now you will get a global variable named chromeCall -->
<sciprt>
  var call = chromeCall.call
  var scope = chromeCall.scope
</sciprt>
```

## Usage

When you do:

```js
const promise = new Promise((resolve, reject) => {
  chrome.storage.local.get('key', items => {
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
import { call } from 'chrome-call'

const promise = call('storage.local.get', 'key')
```

That's really simple, right?

### Multiple arguments in callback

Most of chrome API only has zero or one argument in callback, but someone not, such as [chrome.hid.receive](https://developer.chrome.com/apps/hid#method-receive).

In this situation, pass `true` as the first argument, then the value of promise will be an __real__ Array:

```js
import { call } from 'chrome-call'

call(true, 'hid.receive', connectionId)
  .then(args => {
    Array.isArray(args) // true
    const reportId = args[0]
    const data = args[1]
  })
```

### Scope

The `call` method searches function on `window.chrome`, but you can use different scope:

```js
import { scope } from 'chrome-call'

const callLocal = scope('storage.local') // or scope(chrome.storage.local)
const promise = callLocal('get', 'key')

const callHid = scope('hid') // or scope(chrome.hid)
const promise2 = callHid(true, 'receive')
```

## License

MIT
