# &lt;catalyst-toggle-button&gt;

[Live Demo ↗](http://catalystelements.pages.gitlab.wgtn.cat-it.co.nz/catalyst-toggle-button/#/classes/CatalystToggleButton/demos/es6-component-demo)
|
[API documentation ↗](http://catalystelements.pages.gitlab.wgtn.cat-it.co.nz/catalyst-toggle-button/#/classes/CatalystToggleButton)

`<catalyst-toggle-button>` is a web component toggle button, part of the `Catalyst Elements Collection`.

## Getting Started

Import the component's definition on each page it is to be used on:

```html
<script src="dist/catalyst-toggle-button.js"></script>
```

Then simply use it like any other tag:

```html
<catalyst-toggle-button>My Button</catalyst-toggle-button>
```

## Browser Compatibility

**Not all browser have full support for web components yet.**

[WebComponentsJS](https://github.com/webcomponents/webcomponentsjs) is a set of polyfills that help fill that gap with regard to JavaScript support.  
[ShadyCSS](https://github.com/webcomponents/shadycss) is another polyfill that some browsers may need to help encapsulate CSS.

Install these polyfills via npm:

```sh
npm install --save @webcomponents/webcomponentsjs @webcomponents/shadycss
```

Then include them on each page (before importing the component's definition):

```html
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
<script src="node_modules/@webcomponents/shadycss/custom-style-interface.min.js"></script>
```

### ES5 Support

For older browser that don't support ES6 JavaScript, an ES5 transpiled versions is available (`*.es5.min.js`).

To use this version, include it's script instead of the ES6 version and make sure each page that uses the component imports these scripts (before importing the component's definition):

```html
<script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
<script src="node_modules/@webcomponents/shadycss/custom-style-interface.min.js"></script>
```

## Contributions

Contributions are most welcome.

Please read our [contribution guidelines](./CONTRIBUTING.md).

## Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/) (not npm directly).

Install dependencies with:

```sh
yarn
```

## Building

The build process will create the following versions of the component in the distribution folder (`./dist`):

* an es6 version
* an es6 minified version
* an es5 minified version

The partials (`./src/partials/`) will be inserted into the correct place within these versions.

[Gulp](https://gulpjs.com/) is used to run the build process.  
Build script: `./gulpfile.js`

Build with:

```sh
npm run build
```

## Coding Style

This project uses [ESLint](http://eslint.org/) to lint JavaScript and [Sass Lint](https://github.com/sasstools/sass-lint) to lint Sass.

To test if your code is compliant, run:

```sh
npm run lint
```

## Docs

Docs are build with [Polymer](https://www.polymer-project.org/), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

Docs will automatically be update on GitLab pages whenever a change is pushed to the master branch.

To build the docs manually, first run the analyzer which will update `./analysis.json`. The docs are then built from this file.

```sh
npm run analyze
npm run build-docs
```

The docs will be located under `./build/docs/`.

In order to view the docs in a web browser, the files need to be served from a web server (they cannot be open using file:///).

## Testing

Testing is done using the [web-component-tester](https://github.com/Polymer/web-component-tester).

### Running Tests On The Command Line

```sh
npm run tests
```

### Running Tests In The Browser

First start up a local server:

```sh
python -m SimpleHTTPServer 8000
```

Then visit http://0.0.0.0:8000/test/ to see the tests in action.
