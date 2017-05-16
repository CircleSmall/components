import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const path = require('path')
const buble = require('rollup-plugin-buble')

const builds = {
    'web-standalone-dev': {
        entry: path.resolve(__dirname, './fastScroll/index.js'),
        dest: path.resolve(__dirname, './dist/fastScroll.js'),
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
            resolve({
                jsnext: true,
                main: true,
                browser: true,
            }),
            commonjs(),
            buble()
        ],
        sourceMap: 'inline'
    };

    return config
}

module.exports = genConfig(builds[process.env.TARGET])