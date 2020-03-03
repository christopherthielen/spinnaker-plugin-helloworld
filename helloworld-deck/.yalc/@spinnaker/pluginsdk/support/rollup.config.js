const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
// Use rollup-plugin-ts until the official @rollup/plugin-typescript supports emitting declaration files
const typescript = require('@wessberg/rollup-plugin-ts');
const postCss = require('rollup-plugin-postcss');
const externalGlobals = require('rollup-plugin-external-globals');

module.exports = {
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    // map imports from shared libraries (react, etc) to global variables exposed by spinnaker
    externalGlobals(spinnakerSharedLibraries()),
    // import from .css, .less, and inject into the document <head></head>
    postCss(),
  ],
  output: [{ dir: 'build/dist', format: 'es' }],
};

function spinnakerSharedLibraries() {
  const libraries = ['lodash', 'react', 'react-dom', '@spinnaker/core'];

  function getGlobalVariable(libraryName) {
    const prefix = 'spinnaker.plugins.sharedLibraries';
    const sanitizedLibraryName = libraryName.replace(/[^a-zA-Z0-9_]/g, '_');
    return `${prefix}.${sanitizedLibraryName}`;
  }

  return libraries.reduce((globalsMap, libraryName) => {
    return { ...globalsMap, [libraryName]: getGlobalVariable(libraryName) };
  }, {});
}
