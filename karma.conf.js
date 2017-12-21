module.exports = function(config) {
  const c = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['progress'],
    karmaTypescriptConfig: {
      compilerOptions: {
        lib: ['dom', 'es2015']
      },
      coverageOptions: {
        exclude: /\.(d|spec|test|helper)\.ts/i
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  }

  if (!process.env.TRAVIS) {
    c.browsers.push('Chrome')
  }

  config.set(c)
}
