module.exports = function ( config ) {
  config.set( {
    basePath : '' ,
    frameworks : [ 'jasmine' ] ,
    files : [
      'node_modules/es6-promise/dist/es6-promise.js' ,
      'test/helper.js' ,
      'chrome-call.js' ,
      'test/test.js'
    ] ,
    preprocessors : {
      'chrome-call.js' : [ 'coverage' ]
    } ,
    reporters : [ 'progress' , 'coverage' ] ,
    coverageReporter : {
      dir : 'coverage' ,
      reporters : [
        {
          type : 'html' ,
          subdir : function ( browser ) {
            return 'html/' + browser.toLowerCase().split( /[ /-]/ )[ 0 ];
          }
        } ,
        {
          type : 'lcov' ,
          subdir : 'lcov'
        }
      ]
    } ,
    port : 9876 ,
    colors : true ,
    logLevel : config.LOG_INFO ,
    autoWatch : false ,
    browsers : [ 'Firefox' , 'Chrome' , 'IE' , 'PhantomJS' ] ,
    singleRun : true
  } )
};
