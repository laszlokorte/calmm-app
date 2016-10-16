import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  dest: 'build/bundle.js',
  format: 'iife',

  plugins: [
    commonjs({
      include: ['node_modules/**/*'],
      sourceMap: false,

    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
    }),
    uglify()
  ]
};
