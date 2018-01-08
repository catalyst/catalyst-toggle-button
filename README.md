# &lt;catalyst-toggle-button&gt;

`catalyst-toggle-button` is a toggle button web component.

## Usage

Import the script for the web component on each page it is to be used on:

```html
<script src="dist/catalyst-toggle-button.js"></script>
```

Then simply use it like any other tag:

```html
<catalyst-toggle-button>My Button</catalyst-toggle-button>
```

## Docs ans Demos

Docs and demos are available on [gitlab pages](http://rebeccastevens.pages.gitlab.wgtn.cat-it.co.nz/catalyst-toggle-button/).

## Compatibility

**Not all browser have full support for web components yet.**

[WebComponentsJS](https://github.com/webcomponents/webcomponentsjs) is a set of polyfills that help fill that gap. [ShadyCSS](https://github.com/webcomponents/shadycss) is another polyfill that some browsers may need.

Install via npm:

```sh
npm install --save @webcomponents/webcomponentsjs @webcomponents/shadycss
```

Then include on each page (before importing the component's definition):

```html
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
<script src="node_modules/@webcomponents/shadycss/custom-style-interface.min.js"></script>
```

### ES5

For older browser that don't support ES6 JavaScript, an ES5 transpiled versions is available (`*.es5.min.js`).

To use this version, include it's script instead of the ES6 version and make sure each page that uses the component imports these scripts (before importing the component's definition):

```html
<script src="node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
<script src="node_modules/@webcomponents/shadycss/custom-style-interface.min.js"></script>
```

## Contributing

### Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install/) (not npm directly).  
Install dependencies with:

```sh
yarn
```

### Building

[Gulp](https://gulpjs.com/) is used to build the source files (```./src```) into the distribution files (```./dist```).  
Build with:

```sh
npm run build
```

### Docs

Docs are build with [Polymer](https://www.polymer-project.org/), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

Docs will automatically be update on GitLab pages whenever a change is pushed to the master branch.

To build the docs manually:

```sh
npm run analyze
npm run build-docs
```

The analyze script will update ```analysis.json``` which the docs are then built from.

## Testing

Testing is done using the [web-component-tester](https://github.com/Polymer/web-component-tester).

### Running Tests

#### On The Command Line

```sh
npm run tests
```

#### In The Browser

First start up a local server:

```sh
python -m SimpleHTTPServer 8000
```

Then visit http://0.0.0.0:8000/test/ to see the tests in action.
