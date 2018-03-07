// Import dependencies.
import CatalystToggleMixin from '../../catalyst-toggle-mixin/dist/catalyst-toggle-mixin.js';

const SuperClass = CatalystToggleMixin(HTMLElement);

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
   * @returns {string}
   */
  static get is() {
    return 'catalyst-toggle-button';
  }

  /**
   * Get the default template used by this element.
   *
   * @returns {HTMLTemplateElement}
   */
  static get template() {
    let template = document.createElement('template');
    template.innerHTML = `<style>:host{display:inline-block;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:2px 7px;margin:0;font:400 13.3333px Arial;letter-spacing:normal;word-spacing:normal;color:#000;text-align:center;text-indent:0;text-rendering:auto;text-shadow:none;text-transform:none;cursor:default;background-color:#ddd;border:2px outset #ddd;-o-border-image:none;border-image:none;-o-border-image:initial;border-image:initial;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:button;-moz-appearance:button}:host([pressed]){padding:2px 6px 2px 8px;color:#000;text-shadow:.5px .5px 1px #f0f0f0;background-color:#bbb;border-color:#aaa;border-style:inset}:host([hidden]){display:none}</style><slot></slot>`;  // eslint-disable-line quotes

    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Rename classes as needed to ensure style scoping.
      window.ShadyCSS.prepareTemplate(template, CatalystToggleButton.is);
    }

    return template;
  }

  /**
   * Construct the element.
   */
  constructor() {
    super();

    // Create a shadow root and stamp out the template's content inside.
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(CatalystToggleButton.template.content.cloneNode(true));
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

// Make sure the polyfills are ready (if they are being used).
new Promise((resolve) => {
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    resolve();
  } else {
    window.addEventListener('WebComponentsReady', () => resolve());
  }
}).then(() => {
  // Register the element.
  window.customElements.define(CatalystToggleButton.is, CatalystToggleButton);
});

// Export the element.
export default CatalystToggleButton;
export { CatalystToggleButton };
