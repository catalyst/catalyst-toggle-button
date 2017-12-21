/**
 * A toggle button web component.
 *
 * Based off: https://github.com/GoogleChromeLabs/howto-components/tree/master/elements/howto-toggle-button
 */
(function() {

  /**
   * Create the custom element
   */
  function createElement() {

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
    template.innerHTML = `<style>[[inject:style]][[endinject]]</style>[[inject:template]][[endinject]]`;

    // If using ShadyCSS.
    if (window.ShadyCSS !== undefined) {
      // Rename classes as needed to ensure style scoping.
      ShadyCSS.prepareTemplate(template, elementTagName);
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
       * ### Events
       *
       * Name     | Cause
       * -------- |-------------
       * `change` | Fired when the component's `flipped` value changes due to user interaction.
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

        /**
         * The form element needs to be in the lightDom to work with form elements.
         *
         * @property {HTMLElement} _formElement
         *   The element that will be submitting as part of a form to represent this component.
         */
        this._formElement = document.createElement('input');
        this._formElement.type = 'checkbox';
        this._formElement.style.display = 'none';
        this.appendChild(this._formElement);
      }

      /**
       * Fires when the element is inserted into the DOM.
       */
      connectedCallback() {
        // If using ShadyCSS.
        if (window.ShadyCSS !== undefined) {
          // Style the element.
          ShadyCSS.styleElement(this);
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
       * @param {*} value
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
       * Getter for `pressed`.
       *
       * @returns {boolean}
       */
      get pressed() {
        return this.hasAttribute('pressed');
      }

      /**
       * Setter for `disabled`.
       *
       * @param {*} value
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
       * Getter for `disabled`.
       *
       * @returns {boolean}
       */
      get disabled() {
        return this.hasAttribute('disabled');
      }

      /**
       * Setter for `name`.
       *
       * @param {*} value
       *   The value to set.
       */
      set name(value) {
        this.setAttribute('name', new String(value));
      }

      /**
       * Getter for `name`.
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
       * Setter for `form`.
       *
       * @param {*} value
       *   The value to set.
       */
      set form(value) {
        this._formElement.form = value
        if (this._formElement.hasAttribute('form')) {
          this.setAttribute('form', this._formElement.getAttribute('form'));
        }
      }

      /**
       * Getter for `form`.
       *
       * @returns {HTMLFormElement}
       */
      get form() {
        return this._formElement.form;
      }

      /**
       * Setter for `value`.
       *
       * @param {*} value
       *   The value to set.
       */
      set value(value) {
        this.setAttribute('value', new String(value));
      }

      /**
       * Getter for `value`.
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
            this._formElement.name = newValue;
            break;

          case 'value':
            // Update the form element's value.
            this._formElement.value = newValue;
            break;

          case 'form':
            // Update the form element's form.
            this._formElement.for = newValue;
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
       */
      _togglePressed() {
        // Don't do anything if disabled.
        if (this.disabled) {
          return;
        }

        // Change the value of pressed.
        this.pressed = !this.pressed;

        // This method is only caused by user action so dispatch a change event.
        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            pressed: this.pressed,
          },
          bubbles: true,
        }));
      }
    }

    // Make the class globally accessible.
    window.CatalystToggleButton = CatalystToggleButton;

    // Define the element.
    window.customElements.define(elementTagName, CatalystToggleButton);
  }

  // If not using web component polyfills or if polyfills are ready, create the element.
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    createElement();
  }
  // Otherwise wait until the polyfills is ready.
  else {
    window.addEventListener('WebComponentsReady', () => {
      createElement();
    });
  }
})();
