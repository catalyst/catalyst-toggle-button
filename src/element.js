// Import dependencies.
import { catalystToggleMixin } from '../node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.js';

const SuperClass = catalystToggleMixin(HTMLElement);

/**
 * `<catalyst-toggle-button>` is a toggle button web component.
 *
 *     <catalyst-toggle-button>Button</catalyst-toggle-button>
 *
 * It may include optional form control setting for use in a form.
 *
 *     <catalyst-toggle-button name="form-element-name" value="value">Button</catalyst-toggle-button>
 *
 * ### Focus
 * To focus a catalyst-toggle-button, you can call the native `focus()` method as long as the
 * element has a tab index. Similarly, `blur()` will blur the element.
 *
 * ### Styling
 *
 * Style this element using native css properties; there are no custom properties available for this component.
 *
 * @class
 * @extends HTMLElement
 * @mixes CatalystToggleMixin
 *
 * @customElement
 * @group Catalyst Elements
 * @element catalyst-toggle-button
 * @demo demo/basic.html Basic
 */
class CatalystToggleButton extends SuperClass {
  /**
   * The element's tag name.
   *
   * @public
   * @readonly
   * @returns {string}
   */
  static get is() {
    return 'catalyst-toggle-button';
  }

  /**
   * Get the default template used by this element.
   *
   * @public
   * @readonly
   * @returns {HTMLTemplateElement}
   */
  static get template() {
    const template = document.createElement('template');
    template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`; // eslint-disable-line quotes

    // If using ShadyCSS.
    if (window.ShadyCSS != null) {
      // Rename classes as needed to ensure style scoping.
      window.ShadyCSS.prepareTemplate(template, CatalystToggleButton.is);
    }

    return template;
  }

  /**
   * Construct the element.
   *
   * @public
   */
  constructor() {
    super();

    // Create a shadow root and stamp out the template's content inside.
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(
      CatalystToggleButton.template.content.cloneNode(true)
    );
  }

  /**
   * Fires when the element is inserted into the DOM.
   *
   * @protected
   */
  connectedCallback() {
    // Set this element's role if it's not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }

    super.connectedCallback();
  }
}

/**
 * Register the element.
 */
(async () => {
  // Make sure the polyfills are ready (if they are being used).
  await new Promise(resolve => {
    if (window.WebComponents == null || window.WebComponents.ready) {
      resolve();
    } else {
      window.addEventListener('WebComponentsReady', () => resolve());
    }
  });

  window.customElements.define(CatalystToggleButton.is, CatalystToggleButton);
})();

// Export the element.
export { CatalystToggleButton };
