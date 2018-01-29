/**
 * @constant {string}
 *   The name of the element tag.
 */
const elementTagName = 'catalyst-toggle-button';

/**
 * Key codes.
 *
 * @readonly
 * @enum {number}
 */
const KEYCODE = {
  SPACE: 32,
  ENTER: 13
};

/**
 * @constant {HTMLTemplateElement}
 *   The template of the component.
 */
const template = document.createElement('template');
template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`;  // eslint-disable-line quotes

// If using ShadyCSS.
if (window.ShadyCSS !== undefined) {
  // Rename classes as needed to ensure style scoping.
  window.ShadyCSS.prepareTemplate(template, elementTagName);
}

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
 * There are no custom properties or mixins available for styling this component.
 *
 * @class
 * @extends HTMLElement
 *
 * @customElement
 * @memberof CatalystElements
 * @group Catalyst Elements
 * @element catalyst-toggle-button
 * @demo demo/demo.es5.html ES5 Component Demo
 * @demo demo/demo.es6.html ES6 Component Demo
 */
class CatalystToggleButton extends HTMLElement {

  /**
   * The attributes on this element to observe.
   *
   * @returns {Array.<string>}
   *   The attributes this element is observing for changes.
   */
  static get observedAttributes() {
    return ['pressed', 'disabled', 'name', 'value', 'form'];
  }

  /**
   * Construct the element.
   */
  constructor() {
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
   */
  connectedCallback() {
    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Style the element.
      window.ShadyCSS.styleElement(this);
    }

    // Upgrade the element's properties.
    this._upgradeProperty('pressed');
    this._upgradeProperty('disabled');

    // Set this element's role, tab index and aria attributes if they are not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', 0);
    }
    if (!this.hasAttribute('aria-pressed')) {
      this.setAttribute('aria-pressed', this.pressed);
    }
    if (!this.hasAttribute('aria-disabled')) {
      this.setAttribute('aria-disabled', this.disabled);
    }

    // Add the element's event listeners.
    this.addEventListener('keydown', this._onKeyDown);
    this.addEventListener('click', this._onClick);
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
   * Fires when the element is removed from the DOM.
   */
  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeyDown);
    this.removeEventListener('click', this._onClick);
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
   * @param {string} name
   *   The name of the attribute that changed.
   * @param {*} oldValue
   *   The original value of the attribute that changed.
   * @param {*} newValue
   *   The new value of the attribute that changed.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const hasValue = newValue !== null;
    switch (name) {
      case 'pressed':
        // Set the aria value.
        this.setAttribute('aria-pressed', hasValue);
        break;

      case 'disabled':
        // Set the aria value.
        this.setAttribute('aria-disabled', hasValue);

        // Add/Remove the tabindex attribute based `hasValue`.
        if (hasValue) {
          // If the tab index is set.
          if (this.hasAttribute('tabindex')) {
            this._tabindexBeforeDisabled = this.getAttribute('tabindex');
            this.removeAttribute('tabindex');
            this.blur();
          }
        } else {
          // If the tab index isn't already set and the previous value is known.
          if (!this.hasAttribute('tabindex') && this._tabindexBeforeDisabled !== undefined && this._tabindexBeforeDisabled !== null) {
            this.setAttribute('tabindex', this._tabindexBeforeDisabled);
          }
        }
        break;

      case 'name':
        // Update the form element's name.
        this._inputElement.name = newValue;
        break;

      case 'value':
        // Update the form element's value.
        this._inputElement.value = newValue;
        break;

      case 'form':
        // Update the form element's form.
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
      case KEYCODE.SPACE:
      case KEYCODE.ENTER:
        event.preventDefault();
        this._togglePressed();
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
    this._togglePressed();
  }

  /**
   * `_togglePressed()` calls the `pressed` setter and flips its state.
   * Because `_togglePressed()` is only caused by a user action, it will
   * also dispatch a change event.
   *
   * @fires change
   */
  _togglePressed() {
    // Don't do anything if disabled.
    if (this.disabled) {
      return;
    }

    // Change the value of pressed.
    this.pressed = !this.pressed;

    /**
     * Fire a change event.
     *
     * @event change
     *   Fired when the component's `pressed` value changes due to user interaction.
     */
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        pressed: this.pressed,
      },
      bubbles: true,
    }));
  }
}

// Define the element.
window.customElements.define(elementTagName, CatalystToggleButton);
