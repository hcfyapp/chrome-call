module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/es6-promise/dist/es6-promise.js',
      'test/helper.js',
      'chrome-call.js',
      'test/test.js'
    ],
    preprocessors: {
      'chrome-call.js': ['rollup', 'coverage']
    },
    reporters: ['progress', 'coverage'],
    rollupPreprocessor: {
			plugins: [
				require('rollup-plugin-buble')(),
			],
			format: 'iife',
			moduleName: 'chromeCall',
			sourceMap: 'inline',
		},
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'html',
          subdir: function (browser) {
            return 'html/' + browser.toLowerCase().split(/[ /-]/)[0]
          }
        },
        {
          type: 'lcov',
          subdir: 'lcov'
        }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome', 'PhantomJS'],
    singleRun: true
  })
}
