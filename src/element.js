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
 *
 * @customElement
 * @group Catalyst Elements
 * @element catalyst-toggle-button
 * @demo demo/basic.html Basic
 */
class CatalystToggleButton extends HTMLElement {

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
   * Key codes.
   *
   * @readonly
   * @enum {number}
   * @returns {object}
   */
  static get _KEYCODE() {
    if (this.__keycode === undefined) {
      this.__keycode = {
        SPACE: 32,
        ENTER: 13
      }
    }

    return this.__keycode;
  }

  /**
   * The attributes on this element to observe.
   *
   * @returns {Array.<string>}
   *   The attributes this element is observing for changes.
   */
  static get observedAttributes() {
    return ['checked', 'pressed', 'disabled', 'required', 'name', 'value', 'form'];
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
    // Upgrade the element's properties.
    this._upgradeProperty('checked');
    this._upgradeProperty('pressed');
    this._upgradeProperty('disabled');
    this._upgradeProperty('required');

    // Set the aria attributes.
    this.setAttribute('aria-disabled', this.disabled);
    this.setAttribute('aria-required', this.required);

    // Set this element's role and tab index if they are not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
      this.setAttribute('aria-pressed', this.checked);
    } else if (this.getAttribute('role') !== 'button') {
      this.setAttribute('aria-checked', this.checked);
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', 0);
    }

    // Add the element's event listeners.
    this.addEventListener('keydown', this._onKeyDown);
    this.addEventListener('click', this._onClick);

    // Set up labels on this element.
    this.setUpLabels();

    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Style the element.
      window.ShadyCSS.styleElement(this);
    }
  }

  /**
   * Upgrade the property on this element with the given name.
   *
   * A user may set a property on an _instance_ of an element before its prototype has been connected to this class.
   * This method will check for any instance properties and run them through the proper class setters.
   *
   * See the [lazy properties](/web/fundamentals/architecture/building-components/best-practices#lazy-properties) section for more details.
   *
   * @param {string} prop
   *   The name of a property.
   */
  _upgradeProperty(prop) {
    // If the property exists.
    if (this.hasOwnProperty(prop)) {
      // Delete it and reset it.
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  /**
   * Updated the labels for this element.
   */
  setUpLabels() {
    const id = this.id;
    if (id === undefined || id === '') {
      return;
    }

    const rootNode = 'getRootNode' in this ? this.getRootNode() : document;
    const labels = rootNode.querySelectorAll(`label[for="${id}"]`);

    if (labels && labels.length > 0) {
      let labelledBy = [];
      for (let i = 0; i < labels.length; i++) {
        let label = labels[i];
        if (label.id === '') {
          label.id = this._generateGuid();
        }
        labelledBy.push(label.id);

        if (this.getAttribute('role') !== 'button') {
          // Remove the event listener if it is already set the add it.
          label.removeEventListener('click', this._onLabelClick.bind(this));
          label.addEventListener('click', this._onLabelClick.bind(this));
        }
      }
      this.setAttribute('aria-labelledby', labelledBy.join(' '));
    }
  }

  /**
   * Fires when the element is removed from the DOM.
   *
   * @protected
   */
  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeyDown);
    this.removeEventListener('click', this._onClick);
  }

  /**
   * Setter for `checked`.
   *
   * @param {boolean} value
   *   If truthy, `checked` will be set to true, otherwise `checked` will be set to false.
   */
  set checked(value) {
    const isChecked = Boolean(value);
    if (isChecked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  /**
   * States whether or not this element is checked.
   *
   * @default false
   * @returns {boolean}
   */
  get checked() {
    return this.hasAttribute('checked');
  }

  /**
   * Setter for `pressed`.
   *
   * @param {boolean} value
   *   If truthy, `pressed` will be set to true, otherwise `pressed` will be set to false.
   */
  set pressed(value) {
    const isPressed = Boolean(value);
    if (isPressed) {
      this.setAttribute('pressed', '');
    } else {
      this.removeAttribute('pressed');
    }
  }

  /**
   * States whether or not this element is pressed.
   *
   * @default false
   * @returns {boolean}
   */
  get pressed() {
    return this.hasAttribute('pressed');
  }

  /**
   * Setter for `disabled`.
   *
   * @param {boolean} value
   *   If truthy, `disabled` will be set to true, otherwise `disabled` will be set to false.
   */
  set disabled(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this.setAttribute('disabled', '');
    }
    else {
      this.removeAttribute('disabled');
    }
  }

  /**
   * States whether or not this element is disabled.
   *
   * @default false
   * @returns {boolean}
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  /**
   * Setter for `required`.
   *
   * @param {boolean} value
   *   If truthy, `required` will be set to true, otherwise `required` will be set to false.
   */
  set required(value) {
    const isRequired = Boolean(value);
    if (isRequired) {
      this.setAttribute('required', '');
    }
    else {
      this.removeAttribute('required');
    }
  }

  /**
   * States whether or not this element is required.
   *
   * @default false
   * @returns {boolean}
   */
  get required() {
    return this.hasAttribute('required');
  }

  /**
   * Setter for `name`.
   *
   * @param {string} value
   *   The value to set.
   */
  set name(value) {
    this.setAttribute('name', new String(value));
  }

  /**
   * The name of this element. Used for forms.
   *
   * @returns {string}
   */
  get name() {
    if (this.hasAttribute('name')) {
      return this.getAttribute('name');
    } else {
      return '';
    }
  }

  /**
   * The form this element is apart of.
   *
   * @returns {HTMLFormElement}
   */
  get form() {
    return this._inputElement.form;
  }

  /**
   * Setter for `value`.
   *
   * @param {string} value
   *   The value to set.
   */
  set value(value) {
    this.setAttribute('value', new String(value));
  }

  /**
   * The value this element has. Used for forms.
   *
   * @returns {string}
   */
  get value() {
    if (this.hasAttribute('value')) {
      return this.getAttribute('value');
    } else {
      return 'on';
    }
  }

  /**
   * The input element.
   *
   * @returns {HTMLInputElement}
   */
  get inputElement() {
    return this._inputElement;
  }

  /**
   * Fired when any of the attributes in the `observedAttributes` array change.
   *
   * @protected
   * @param {string} name
   *   The name of the attribute that changed.
   * @param {*} oldValue
   *   The original value of the attribute that changed.
   * @param {*} newValue
   *   The new value of the attribute that changed.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    let hasValue = newValue !== null;

    switch (name) {
      case 'checked':
      case 'pressed':
        // Set the aria value.
        if (this.getAttribute('role') === 'button') {
          this.setAttribute('aria-pressed', hasValue);
        } else {
          this.setAttribute('aria-checked', hasValue);
        }

        if (hasValue) {
          this.inputElement.setAttribute('checked', '');
        } else {
          this.inputElement.removeAttribute('checked');
        }
        break;

      case 'disabled':
        // Set the aria value.
        this.setAttribute('aria-disabled', hasValue);

        if (hasValue) {
          this.inputElement.setAttribute('disabled', '');

          // If the tab index is set.
          if (this.hasAttribute('tabindex')) {
            this._tabindexBeforeDisabled = this.getAttribute('tabindex');
            this.removeAttribute('tabindex');
            this.blur();
          }
        } else {
          this.inputElement.removeAttribute('disabled');

          // If the tab index isn't already set and the previous value is known.
          if (!this.hasAttribute('tabindex') && this._tabindexBeforeDisabled !== undefined && this._tabindexBeforeDisabled !== null) {
            this.setAttribute('tabindex', this._tabindexBeforeDisabled);
          }
        }
        break;

      case 'required':
        // Set the aria attribue.
        this.setAttribute('aria-required', hasValue);

        if (hasValue) {
          this.inputElement.setAttribute('required', '');
        }
        else {
          this.inputElement.removeAttribute('required');
        }
        break;

      case 'name':
        // Update the input element's name.
        this.inputElement.setAttribute('name', new String(newValue));
        break;

      case 'value':
        // Update the input element's value.
        this.inputElement.setAttribute('value', new String(newValue));
        break;

      case 'form':
        // Update the input element's form.
        this._inputElement.setAttribute('form', newValue);
        break;
    }
  }

  /**
   * Called when a key is pressed on this element.
   *
   * @param {KeyboardEvent} event
   */
  _onKeyDown(event) {
    // Don’t handle modifier shortcuts typically used by assistive technology.
    if (event.altKey) {
      return;
    }

    // What key was pressed?
    switch (event.keyCode) {
      case CatalystToggleButton._KEYCODE.SPACE:
      case CatalystToggleButton._KEYCODE.ENTER:
        event.preventDefault();
        this._toggleChecked();
        break;

      // Any other key press is ignored and passed back to the browser.
      default:
        return;
    }
  }

  /**
   * Called when this element is clicked.
   */
  _onClick() {
    this._toggleChecked();
  }

  /**
   * Called when a label of this element is clicked.
   */
  _onLabelClick() {
    this._toggleChecked();
  }

  /**
   * `_toggleChecked()` calls the either the `checked` or `pressed` setter and flips its state.
   * Because `_toggleChecked()` is only caused by a user action, it will
   * also dispatch a change event.
   *
   * @fires change
   */
  _toggleChecked() {
    // Don't do anything if disabled.
    if (this.disabled) {
      return;
    }

    // The detail of the event.
    let detail;

    if (this.getAttribute('role') === 'button') {
      // Change the value of pressed.
      this.pressed = !this.pressed;
      detail = {pressed: this.pressed};
    } else {
      // Change the value of checked.
      this.checked = !this.checked;
      detail = {checked: this.checked};
    }

    /**
     * Fired when the component's `pressed` value changes due to user interaction.
     *
     * @event change
     */
    this.dispatchEvent(new CustomEvent('change', {
      detail: detail,
      bubbles: true,
    }));
  }

  /**
   * Generate a guid (or at least something that seems like one)
   *
   * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
   */
  _generateGuid() {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
