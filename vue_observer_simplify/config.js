const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const buble = require('rollup-plugin-buble')

const builds = {
    // Runtime+compiler standalone development build.
    'web-standalone-dev': {
        entry: path.resolve(__dirname, './index.js'),
        dest: path.resolve(__dirname, './dist/observer.js'),
        format: 'umd',
        env: 'development'
    },
}

function genConfig(opts) {
    const config = {
        entry: opts.entry,
        dest: opts.dest,
        external: opts.external,
        format: opts.format,
        moduleName: 'Vue',
        plugins: [
            flow(),
            buble()
        ]
    }

    return config
}

module.exports = genConfig(builds[process.env.TARGET])
