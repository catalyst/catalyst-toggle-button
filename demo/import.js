// Import the helpers.
import '../node_modules/@polymer/iron-demo-helpers/demo-snippet.js';

// Import the element.
import { CatalystToggleButton } from '../node_modules/@catalyst-elements/catalyst-toggle-button/dist/catalyst-toggle-button.module.js';

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystToggleButton.register();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystToggleButton.register();
  });
}
