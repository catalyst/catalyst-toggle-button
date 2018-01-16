/* eslint-env node */

// The name of the element.
const elementName = 'catalyst-toggle-button';

// The name of the analysis file.
const analysisFilename = 'analysis';

// Paths.
const srcPath = './src';
const distPath = './dist';
const tmpPath = './tmp';

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const analyzer = Analyzer.createForDirectory('./');
const Builder = require('polymer-build').PolymerProject;
const docBuilder = new Builder(require('./polymer.json'));
const clean = require('gulp-clean');
const closureCompiler = require('google-closure-compiler').gulp();
const eslint = require('gulp-eslint');
const file = require('gulp-file');
const htmlExtract = require('gulp-html-extract');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const mergeStream = require('merge-stream');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const stripComments = require('gulp-strip-comments');

/**
 * Convert a class name to an element name.
 *
 * Eg: Foo.BarBaz --> bar-baz
 *
 * @param {string} className
 */
function classNameToElementName(className) {
  return className.substring(className.lastIndexOf('.') + 1).split(/(?=[A-Z])/).join('-').toLowerCase();
}

/**
 * Fix issues with the automatically generated analysis.
 *
 * * @param {object} analysis
 */
function fixAnalysis(analysis) {
  // If `namespaces` is defined.
  if (analysis.namespaces) {
    for (let i = 0; i < analysis.namespaces.length; i++) {
      // For the `CatalystElements` namespace.
      if (analysis.namespaces[i].name === 'CatalystElements') {

        // If `elements` is defined.
        if (analysis.namespaces[i].elements) {
          // For each element.
          for (let j = 0; j < analysis.namespaces[i].elements.length; j++) {

            // If the element's tag name is not set, set it.
            if (analysis.namespaces[i].elements[j].tagname === undefined) {
              analysis.namespaces[i].elements[j].tagname = classNameToElementName(analysis.namespaces[i].elements[j].name);
            }

            // Change the path.
            analysis.namespaces[i].elements[j].path = `dist/${elementName}.js`;

            // If `events` is defined
            if (analysis.namespaces[i].elements[j].events) {
              // For each event.
              for (let k = 0; k < analysis.namespaces[i].elements[j].events.length; k++) {
                // Fix up event descriptions.
                // Remove the name of the event from the beginning of its description.
                analysis.namespaces[i].elements[j].events[k].description = analysis.namespaces[i].elements[j].events[k].description.replace(new RegExp('^' + analysis.namespaces[i].elements[j].events[k].name), '').trim();
              }
            }
          }
        }
      }
    }
  }

  return analysis;
}

/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8')
}

// Lint JS
gulp.task('lint:js', () => {
  return gulp.src([
      '*.js',
      'src/**/*.js',
      'test/**/*.js',
      'demo/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint JS in HTML
gulp.task('lint:js-html', () => {
  return gulp.src([
      '*.html',
      'src/**/*.html',
      'test/**/*.html',
      'demo/**/*.html'
    ])
    .pipe(htmlExtract({
      sel: 'script',
      strip: true
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Lint SCSS
gulp.task('lint:scss', () => {
  return gulp.src('src/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Lint the project
gulp.task('lint', gulp.parallel('lint:js', 'lint:js-html', 'lint:scss'));

// Minify HTML.
gulp.task('html-min', () => {
  return gulp.src(`${srcPath}/**/*.html`)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Compile Sass.
gulp.task('sass-compile', () => {
  return gulp.src(`${srcPath}/**/*.scss`)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss())
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Clean the dist path.
gulp.task('clean-dist', () => {
  return gulp.src(distPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Clean the tmp path.
gulp.task('clean-tmp', () => {
  return gulp.src(tmpPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Inject the template html and css into the custom element.
gulp.task('inject', () => {
  return gulp.src(`${srcPath}/${elementName}.js`)
    // Inject the template html.
    .pipe(inject(gulp.src(`${tmpPath}/partials/template.html`), {
      starttag: '[[inject:template]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    // Inject the style css.
    .pipe(inject(gulp.src(`${tmpPath}/partials/style.css`), {
      starttag: '[[inject:style]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    .pipe(gulp.dest(tmpPath));
});

// Build the es6 full version of the components.
gulp.task('build-es6-full', gulp.series(gulp.parallel('html-min', 'sass-compile'), 'inject'));

// Build the es6 version of the component.
gulp.task('build-es6', gulp.series('build-es6-full' , () => {
  return gulp.src(`${tmpPath}/${elementName}.js`)
    .pipe(stripComments())
    .pipe(gulp.dest(distPath));
}));

// Build the minified es6 version of the component.
gulp.task('build-es6-min', () => {
  return gulp.src(`${distPath}/${elementName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT',
      output_wrapper: '(()=>{\n%output%\n}).call(this)',
      js_output_file: `${elementName}.min.js`
    }))
    .pipe(gulp.dest(distPath));
});

// Build the minified es5 version of the component.
gulp.task('build-es5-min', () => {
  return gulp.src(`${distPath}/${elementName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: '(function(){\n%output%\n}).call(this)',
      js_output_file: `${elementName}.es5.min.js`
    }))
    .pipe(gulp.dest(distPath));
});
// Analyze the elements file.
gulp.task('create-analysis', () => {
  return analyzer.analyze([`${tmpPath}/${elementName}.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', 'build-es6', gulp.parallel('build-es6-min', 'build-es5-min')));

// Build the docs for all the components' versions.
gulp.task('build-docs', () => {
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest('docs'));
});

// Analyze all the components.
gulp.task('analyze', gulp.series('build-es6-full', 'create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build', 'clean-tmp'));
