export default {
  entry: 'src/index.js',
  format: 'cjs',
  dest: 'build/bundle.js',
  external: ['dgram', 'os', 'events', 'net']
}
