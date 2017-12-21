module.exports = function(config) {
  const c = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'coverage'],
      'test/**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'coverage', 'karma-typescript'],
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
        dir: 'coverage',
        subdirectory: 'lcov'
      }
    }
  } else {
    c.karmaTypescriptConfig.reports = {
      html: 'coverage'
    }
    c.browsers.push('Chrome')
  }

  config.set(c)
}
