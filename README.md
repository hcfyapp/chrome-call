# chrome-call [![Build Status](https://img.shields.io/travis/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://travis-ci.org/Selection-Translator/chrome-call) [![Coverage Status](https://img.shields.io/coveralls/Selection-Translator/chrome-call/master.svg?style=flat-square)](https://coveralls.io/github/Selection-Translator/chrome-call?branch=master) [![NPM Version](https://img.shields.io/npm/v/chrome-call.svg?style=flat-square)](https://www.npmjs.com/package/chrome-call)

Call the [Chrome JavasScript APIs](https://developer.chrome.com/extensions/api_index) then return a Promise.

## Install

### Use with webpack

If you build your project with webpack, then you can install chrome-call from npm:

```
npm install chrome-call
```

then you can import it in your project:

```js
// es6
import chromeCall from 'chrome-call'

// commonjs
const chromeCall = require('chrome-call')
```

### Use with &lt;script&gt;

Download chrome-call.js from [unpkg](https://unpkg.com/chrome-call)([min version](https://unpkg.com/chrome-call/dist/chrome-call.min.js)), then reference it in your html:

```html
<script src="path/to/chrome-call.js"></script>
<!-- now you will get a global variable named chromeCall -->
<script>
  typeof chromeCall // function
</script>
```

## Usage

When you do:

```js
const promise = new Promise((resolve, reject) => {
  chrome.tabs.sendMessage(tabId, message, options, response => {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError)
    } else {
      resolve(response)
    }
  })
})
```

It's equal to:

```js
const promise = chromeCall(chrome.tabs, 'sendMessage', tabId, message, options)
```

That's really simple, right?

### Multiple arguments in callback

Most of chrome API only has zero or one argument in callback, but someone not, such as [chrome.hid.receive](https://developer.chrome.com/apps/hid#method-receive).

In this situation, pass `true` as the first argument, then the value of promise will be an **real** Array:

```js
import chromeCall from 'chrome-call'

chromeCall(true, chrome.hid, 'receive', connectionId).then(args => {
  Array.isArray(args) // true
  const reportId = args[0]
  const data = args[1]
})
```

## License

MIT
