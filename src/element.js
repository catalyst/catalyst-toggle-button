// Import dependencies.
import CatalystToggleMixin from '../node_modules/@catalyst-elements/catalyst-toggle-mixin/catalyst-toggle-mixin.js';

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
    template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`;  // eslint-disable-line quotes

    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Rename classes as needed to ensure style scoping.
      window.ShadyCSS.prepareTemplate(template, CatalystToggleButton.is);
    }

    return template;
  }

  /**
   * Construct the element.
   *
   * @param {HTMLTemplate} [template]
   *   The template to use.
   */
  constructor(template = CatalystToggleButton.template) {
    super();

    // Create a shadow root and stamp out the template's content inside.
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // The input element needs to be in the lightDom to work with form elements.

    /**
     * The element that will be submitting as part of a form to represent this component.
     *
     * @type {HTMLElement}
     */
    this._inputElement = document.createElement('input');
    this._inputElement.type = 'checkbox';
    this._inputElement.style.display = 'none';
    this.appendChild(this._inputElement);
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
