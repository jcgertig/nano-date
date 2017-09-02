import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/index.js',
  format: 'iife',
  moduleName: 'NanoDate',
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    replace({
      'process.env': JSON.stringify('{}'),
    }),
    uglify()
  ],
  dest: 'build/nano-date.js'
  sourceMap: true,
};
