var build = require('gulp');
var path = require('path');
var config = require('../config');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var es6Transpiler = require('gulp-babel');
var clientBuilder = require('webpack');
var processhtml = require('gulp-preprocess');
var del = require('del');

build.task('build', function(done) {
  runSequence('clean', 'build:devServers', 'build:ContextGenerator',
              'build:CPSAnalytics', 'build:docs',
              ['codeLint', 'styleCheck', 'test:unit'], done);
});

build.task('clean', function(done) {
  del(config.dist, done);
});

build.task('build:ContextGenerator', function() {
  //Copy views
  build.src(config.srcContextGenerator + '/Views/**')
       .pipe(build.dest(config.distContextGenerator + '/Views'));

  return transpileWithSourceMaps(config.srcContextGenerator, config.distContextGenerator);
});

build.task('build:CPSAnalytics', function(done) {
  transpileWithSourceMaps(config.srcCPSAnalytics, config.distCPSAnalytics);

  //Copy index.html
  build.src(config.srcCPSAnalytics + '/index.html')
              .pipe(processhtml())
              .pipe(build.dest(config.distCPSAnalytics));

  //Copy js
  build.src('node_modules/babel-core/browser-polyfill.min.js')
       .pipe(build.dest(config.distCPSAnalytics));

  if (process.env.NODE_ENV === 'production') {
    config.clientBuildSettings.entry = [config.clientBuildSettings.entry[1]];
  }

  //Start bundler
  clientBuilder(config.clientBuildSettings, function(err, status) {
    if (err) throw new Error('Webpack-Error: ', err);
    done();
  });
});

build.task('build:devServers', function() {
  return transpileWithSourceMaps(config.srcServers, config.distServer);
});

build.task('build:docs', function() {
  //Copy swagger ui
  build.src('swagger-ui/dist/**/*')
       .pipe(build.dest(config.distDocs + '/swagger'));

  //Copy swagger spec
  build.src('docs/api/contextGenerator.json')
       .pipe(build.dest(config.distDocs + '/swagger'));
});

function transpileWithSourceMaps(sourcePath, destPath, sourceMapsPath) {
  sourcePath = [sourcePath + '/**/*.js', sourcePath + '/**/*.jsx'];

  if (!sourceMapsPath) {
    sourceMapsPath = '.';
  }

  return build.src(sourcePath)
              .pipe(sourcemaps.init())
              .pipe(es6Transpiler({
                optional: ['es7.classProperties','es7.objectRestSpread', 'es7.decorators']
              }))
              .pipe(sourcemaps.write('.'))
              .pipe(build.dest(destPath));
}
