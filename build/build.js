const path = require('path')
const fs = require('fs-extra')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const banner = [
  '/*!',
  ' * chrome-call v' + pkg.version,
  ' * https://github.com/Selection-Translator/chrome-call',
  ' * Released under the MIT License.',
  ' */'
].join('\n')

rollup.rollup({
  entry: path.resolve(__dirname, '../chrome-call.js'),
  plugins: []
}).then(bundle => {
  // 输出 umd 格式
  const { code } = bundle.generate({
    format: 'umd',
    moduleName: 'chromeCall',
    banner
  })

  fs.writeFile(path.resolve(__dirname, '../dist/chrome-call.js'), code)
  fs.writeFile(path.resolve(__dirname, '../dist/chrome-call.min.js'), uglifyJS.minify(code, { output: { comments: /^!/ } }).code)

  // 输出 es 格式
  bundle.write({
    dest: path.resolve(__dirname, '../dist/chrome-call.esm.js'),
    format: 'es',
    banner
  })

  // 输出 cjs 格式
  bundle.write({
    dest: path.resolve(__dirname, '../dist/chrome-call.common.js'),
    format: 'cjs',
    banner
  })
})
