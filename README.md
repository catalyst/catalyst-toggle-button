# &lt;catalyst-toggle-button&gt;

[![Travis](https://img.shields.io/travis/catalyst/catalyst-toggle-button/master.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-toggle-button)
[![David](https://img.shields.io/david/catalyst/catalyst-toggle-button.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-button)
[![David](https://img.shields.io/david/dev/catalyst/catalyst-toggle-button.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-button?type=dev)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/catalyst/catalyst-toggle-button)
[![npm (scoped)](https://img.shields.io/npm/v/@catalyst-elements/catalyst-toggle-button.svg?style=flat-square)](https://www.npmjs.com/package/@catalyst-elements/catalyst-toggle-button)
[![Bower not supported](https://img.shields.io/badge/bower-not_supported-red.svg?style=flat-square)]()
[![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-not_supported-red.svg?style=flat-square)]()
[![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-support_pending-yellow.svg?style=flat-square)]()

[Live Demo ↗](https://catalyst.github.io/CatalystElementsBundle/#/elements/catalyst-toggle-button/demos/basic)
|
[API documentation ↗](https://catalyst.github.io/CatalystElementsBundle/#/elements/catalyst-toggle-button)

`<catalyst-toggle-button>` is a web component toggle button, part of the `Catalyst Elements Collection`.

## Example Usage

<!---
```
<custom-element-demo>
  <template>
    <script type="module" src="catalyst-toggle-button.js"></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<catalyst-toggle-button>My Button</catalyst-toggle-button>
```

## Installation

Install with npm:

```sh
npm install --save @catalyst-elements/catalyst-toggle-button
```

Install with yarn:

```sh
yarn add @catalyst-elements/catalyst-toggle-button
```

Please note that this package is not compatible with Bower.

## Usage

### As a Module (Recommend)

Import the module on each page that uses the component.

```html
<script type="module" src="node_modules/@catalyst-elements/catalyst-toggle-button/catalyst-toggle-button.js"></script>
```

Then simply use it like any other tag.

### As a Script

Import the script for the component on each page that it is uses on.

Note: you will also have to import the dependencies the component uses first.

```html
<!-- Import dependencies -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.es5.min.js"></script>

<!-- Import the element -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-button/catalyst-toggle-button.es5.min.js"></script>
```

Please note that this script has been transpiled to es5 and thus use of `custom-elements-es5-adapter.js` or an equivalent library is required. See [es5 support](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility#es5-support) on the Catalyst Elements wiki for details.

The element can then be use it like any other tag.

## Browser Compatibility

See details on the Catalyst Elements' wiki: [Browser Compatibility](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility)

## Contributions

Contributions are most welcome.

Please read our [contribution guidelines](./CONTRIBUTING.md).
