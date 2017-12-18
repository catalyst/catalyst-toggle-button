// Libraries.
const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
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
gulp.task('fix-dependency-tree', () => {
  // Some components want access to "node_modules/@webcomponents/" without going through "@webcomponents"
  return gulp.src('./node_modules/@webcomponents/**/*')
    .pipe(gulp.dest('./node_modules/'));
});

// Default task.
gulp.task('default', ['build'], () => {
  return gulp.src(tmpPath, {read: false}).pipe(clean());
});
