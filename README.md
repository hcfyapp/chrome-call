# chrome call

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
