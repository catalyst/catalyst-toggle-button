// Import the helpers.
import '../node_modules/@polymer/iron-demo-helpers/demo-snippet.js';

/**
 * Load the polymer elements.
 */
function loadPolymerElements() {
  import('../node_modules/@polymer/iron-demo-helpers/demo-snippet.js');
}

// Register the element.
if (window.WebComponents === undefined || window.WebComponents.ready) {
  CatalystToggleButton.register();
  loadPolymerElements();
} else {
  window.addEventListener('WebComponentsReady', () => {
    CatalystToggleButton.register();
    loadPolymerElements();
  });
}
