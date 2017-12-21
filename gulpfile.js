/* eslint-env node */

// Libraries.
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const jeditor = require('gulp-json-editor');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

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

// Minify HTML.
gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(tmpPath));
});

// Compile Sass.
gulp.task('sass', () => {
  return gulp.src(srcPath + '/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(tmpPath));
});

// Inject the template html and css into custom element.
gulp.task('inject', ['html', 'sass'], () => {
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

// Fix dependency tree.
//
// Why is this needed?
// Many dependencies being used are in the process of switching from
// bower to npm. Thus some dependencies are trying to access other
// dependencies in incorrect ways. This task makes it so both ways work.
gulp.task('fix-dependency-tree', () => {
  // Some dependencies want access to "node_modules/@webcomponents/" without going through "@webcomponents"
  gulp.src('./node_modules/@webcomponents/**/*')
    .pipe(gulp.dest('./node_modules/'));

  // Some dependencies want access to "node_modules/@polymer/" without going through "@polymer"
  gulp.src('./node_modules/@polymer/**/*')
    .pipe(gulp.dest('./node_modules/'));

  // Create sinonjs as the sinon lib folder.
  gulp.src('./node_modules/sinon/lib/**/*')
    .pipe(gulp.dest('./node_modules/sinonjs/'));

  // Some dependencies want to access async/dist as async/lib.
  gulp.src('./node_modules/async/dist/**/*')
  .pipe(gulp.dest('./node_modules/async/lib/'));

  return gulp;
});


// Fix issues with analysis.json
gulp.task('analysis-fixer', () => {
  return gulp.src("./analysis.json")
    .pipe(jeditor(function(json) {

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
