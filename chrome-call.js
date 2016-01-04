(function ( root , factory ) {
  /* istanbul ignore next */
  if ( typeof module === 'object' && typeof module.exports === 'object' ) {
    module.exports = factory();
  } else if ( typeof define === 'function' && define.amd ) {
    define( [] , factory );
  } else {
    root[ 'chromeCall' ] = factory();
  }
})( this , function () {
  var slice = Array.prototype.slice ,
    runtime = chrome.runtime;

  /**
   * 根据 base 对象返回指定路径的栈
   * @param {String} path - 属性路径，可用点（.）分隔
   * @param {String|Object} base - 开始查找的那个对象
   * @returns {*[]}
   *
   * @example
   *   pathStack('document.body',window) 应该返回 [window,window.document,window.document.body]
   */
  function pathStack( path , base ) {
    if ( typeof base === 'string' ) {
      base = pathStack( base , chrome ).pop();
    }

    var keys = path.split( '.' ) ,
      paths = [ base ];

    keys.forEach( function ( key , i ) {
      var val = paths[ i ][ key ];
      if ( !val ) {
        throw new Error( 'Cannot find "' + path + '".' );
      }
      paths.push( val );
    } );

    return paths;
  }

  /**
   * 根据基础对象返回一个函数，此函数会以基础对象为起点寻找指定属性并调用
   * @param base
   * @returns {Function}
   */
  function scope( base ) {
    return function ( fnPath /*, ...args*/ ) {
      // Step 1: find the function which need to be call
      var paths = pathStack( fnPath , base );

      var args = slice.call( arguments , 1 );
      return new Promise( function ( resolve , reject ) {
        // Step 2: inject callback
        args.push( function () {
          var lastError = runtime.lastError;
          if ( lastError ) {
            reject( lastError );
            return;
          }

          resolve( arguments.length <= 1 ? arguments[ 0 ] : slice.call( arguments , 0 ) );
        } );

        // Step 3: call function with it's original "this"
        paths.pop().apply( paths.pop() , args );
      } );
    };
  }

  var defaultCp = scope( chrome );
  defaultCp.scope = scope;
  return defaultCp;
} );
