const path = require('path')
const buble = require('rollup-plugin-buble')

const builds = {
    'web-standalone-dev': {
        entry: path.resolve(__dirname, './suggest/index.js'),
        dest: path.resolve(__dirname, './dist/suggest.js'),
        // format: 'umd',
        env: 'development'
    }
};

function genConfig(opts) {
    const config = {
        entry: opts.entry,
        dest: opts.dest,
        external: opts.external,
        format: opts.format,
        plugins: [
            buble()
        ],
        // sourceMap: 'inline'
    };

    return config
}

module.exports = genConfig(builds[process.env.TARGET])