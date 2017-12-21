
require('fs-extra').emptyDirSync(require('path').resolve(__dirname, './coverage'))

module.exports = function(config) {
  const c = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'karma-typescript'],
    karmaTypescriptConfig: {
      compilerOptions: {
        lib: ['dom', 'es2015']
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  }

  if (process.env.TRAVIS) {
    c.karmaTypescriptConfig.reports = {
      lcovonly: {
        directory: 'coverage',
        subdirectory: 'lcov'
      }
    }
  } else {
    c.karmaTypescriptConfig.reports = {
      html: {
        directory: 'coverage',
        subdirectory: ''
      }
    }
    c.browsers.push('Chrome')
  }

  config.set(c)
}
