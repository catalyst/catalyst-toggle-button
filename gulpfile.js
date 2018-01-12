/* eslint-env node */

// Libraries.
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const eslint = require('gulp-eslint');
const htmlExtract = require('gulp-html-extract');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const jsonEditor = require('gulp-json-editor');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');

const elementName = 'catalyst-toggle-button';

const srcPath = './src';
const distPath = './dist';
const tmpPath = './tmp';

/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8')
}

// Lint the project
gulp.task('lint', ['lint:js', 'lint:js-html', 'lint:scss']);

// Lint JS
gulp.task('lint:js', function() {
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
gulp.task('lint:js-html', function() {
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
gulp.task('lint:scss', function() {
  return gulp.src([
    'src/**/*.scss'
  ])
  .pipe(sassLint())
  .pipe(sassLint.format())
  .pipe(sassLint.failOnError())
});

// Minify HTML.
gulp.task('html-min', () => {
  return gulp.src(srcPath + '/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Compile Sass.
gulp.task('sass-compile', () => {
  return gulp.src(srcPath + '/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss())
    .pipe(replace('\n', ''))
    .pipe(gulp.dest(tmpPath));
});

// Inject the template html and css into custom element.
gulp.task('inject', ['html-min', 'sass-compile'], () => {
  return gulp.src(srcPath + '/' + elementName + '.js')
    // Inject the template html.
    .pipe(inject(gulp.src(tmpPath + '/partials/template.html'), {
      starttag: '[[inject:template]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    // Inject the style css.
    .pipe(inject(gulp.src(tmpPath + '/partials/style.css'), {
      starttag: '[[inject:style]]',
      endtag: '[[endinject]]',
      removeTags: true,
      transform: transformGetFileContents
    }))
    .pipe(gulp.dest(distPath));
});

// Clean the dist path.
gulp.task('clean-dist', () => {
  return gulp.src(distPath, {read: false}).pipe(clean());
});

// Build the component.
gulp.task('build', ['clean-dist', 'inject'], () => {
  // Build the minified es6 version of the component.
  gulp.src(distPath + '/' + elementName + '.js')
    .pipe(babel({
      presets: ['minify']
    }))
    .pipe(rename((path) => {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(distPath));

  // Build the minified es5 version of the component.
  gulp.src(distPath + '/' + elementName + '.js')
    .pipe(babel({
      presets: ['env', 'minify']
    }))
    .pipe(rename((path) => {
      path.basename += '.es5.min';
    }))
    .pipe(gulp.dest(distPath));

  return gulp;
});

// Fix issues with analysis.json
gulp.task('analysis-fixer', () => {
  return gulp.src("./analysis.json")
    .pipe(jsonEditor(function(json) {

      // If `classes` is defined.
      if (json.classes) {
        // For each class.
        for (let i = 0; i < json.classes.length; i++) {
          // If `demos` is defined.
          if (json.classes[i].demos) {
            // Fix issue with each demo appearing in the demo array twice.

            // Loop through each demo and save it if it has a url that no previous demo had.
            let demosObj = {};
            for (let j = 0; j < json.classes[i].demos.length; j++) {
              let url = json.classes[i].demos[j].url;
              if (!demosObj[url]) {
                demosObj[url] = json.classes[i].demos[j];
              }
            }

            // Convert the demo object into an array.
            let demosArr = [];
            for (let demo in demosObj) {
              demosArr.push(demosObj[demo]);
            }

            // Update the array of demos.
            json.classes[i].demos = demosArr;
          }
        }
      }

      // Return the modified json.
      return json;
    }))
    .pipe(gulp.dest("./"));
});

// Default task.
gulp.task('default', ['build'], () => {
  return gulp.src(tmpPath, {read: false}).pipe(clean());
});
