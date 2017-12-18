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

## Demos

There are 2 demos available:

* [demo.es5.html](./demo/demo.es5.html) - Uses the ES5 transpiled component
* [demo.es6.html](./demo/demo.es6.html) - Uses the original ES6 component

## Compatibility

**Not all browser have full support for web components yet.**

[WebComponentsJS](https://github.com/webcomponents/webcomponentsjs) is a set of polyfills that help fill that gap. [ShadyCSS](https://github.com/webcomponents/shadycss) is another polyfill that some browsers may need.

Install via npm:

```sh
npm install --save @webcomponents/webcomponentsjs @webcomponents/shadycss
```

Then include on each page (before importing the component's efinition):

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
