const path = require('path')
const fs = require('fs-extra')

// 清空输出目录
fs.emptyDirSync(path.resolve(__dirname, '../dist'))

// 编译 js
const rollup = require('rollup')
const typescript = require('rollup-plugin-typescript2')
const uglifyJS = require('uglify-js')
const pkg = require('../package.json')

const banner = [
  '/*!',
  ' * chrome-call v' + pkg.version,
  ' * https://github.com/Selection-Translator/chrome-call',
  ' * Released under the MIT License.',
  ' */'
].join('\n')

rollup
  .rollup({
    input: path.resolve(__dirname, '../src/index.ts'),
    plugins: [
      typescript({
        tsconfigOverride: {
          exclude: ['test/**/*.ts']
        }
      })
    ]
  })
  .then(bundle => {
    // 输出 umd 格式
    const umdFilePath = path.resolve(__dirname, '../dist/chrome-call.js')
    // 用 bundle.generate 不知为何得到的 result 是 undefined，
    // 所以这里直接用了 write
    bundle
      .write({
        file: umdFilePath,
        format: 'umd',
        name: 'chromeCall',
        banner
      })
      .then(() => {
        fs.writeFile(
          path.resolve(__dirname, '../dist/chrome-call.min.js'),
          uglifyJS.minify(fs.readFileSync(umdFilePath, 'utf8'), {
            output: { comments: /^!/ }
          }).code
        )
      })

    // 输出 es 格式
    bundle.write({
      file: path.resolve(__dirname, '../dist/chrome-call.esm.js'),
      format: 'es',
      banner
    })

    // 输出 cjs 格式
    bundle.write({
      file: path.resolve(__dirname, '../dist/chrome-call.common.js'),
      format: 'cjs',
      banner
    })
  })
