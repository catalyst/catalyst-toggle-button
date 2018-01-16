(function() {

  window.CatalystElements = window.CatalystElements || {};

  function createElement() {

    const elementTagName = 'catalyst-toggle-button';

    const KEYCODE = {
      SPACE: 32,
      ENTER: 13
    };

    const template = document.createElement('template');
    template.innerHTML = `<style>:host{display:inline-block;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:2px 7px;margin:0;font:400 13.3333px Arial;letter-spacing:normal;word-spacing:normal;color:#000;text-align:center;text-indent:0;text-rendering:auto;text-shadow:none;text-transform:none;cursor:default;background-color:#ddd;border:2px outset #ddd;-o-border-image:none;border-image:none;-o-border-image:initial;border-image:initial;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:button;-moz-appearance:button}:host([pressed]){padding:2px 6px 2px 8px;color:#000;text-shadow:.5px .5px 1px #f0f0f0;background-color:#bbb;border-color:#aaa;border-style:inset}:host([hidden]){display:none}</style><slot></slot>`;

    if (window.ShadyCSS !== undefined) {
      window.ShadyCSS.prepareTemplate(template, elementTagName);
    }

    class CatalystToggleButton extends HTMLElement {

      static get observedAttributes() {
        return ['pressed', 'disabled', 'name', 'value', 'form'];
      }

      constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));


        this._inputElement = document.createElement('input');
        this._inputElement.type = 'checkbox';
        this._inputElement.style.display = 'none';
        this.appendChild(this._inputElement);
      }

      connectedCallback() {
        if (window.ShadyCSS !== undefined) {
          window.ShadyCSS.styleElement(this);
        }

        this._upgradeProperty('pressed');
        this._upgradeProperty('disabled');

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

        this.addEventListener('keydown', this._onKeyDown);
        this.addEventListener('click', this._onClick);
      }

      _upgradeProperty(prop) {
        if (this.hasOwnProperty(prop)) {
          let value = this[prop];
          delete this[prop];
          this[prop] = value;
        }
      }

      disconnectedCallback() {
        this.removeEventListener('keydown', this._onKeyDown);
        this.removeEventListener('click', this._onClick);
      }

      set pressed(value) {
        const isPressed = Boolean(value);
        if (isPressed) {
          this.setAttribute('pressed', '');
        } else {
          this.removeAttribute('pressed');
        }
      }

      get pressed() {
        return this.hasAttribute('pressed');
      }

      set disabled(value) {
        const isDisabled = Boolean(value);
        if (isDisabled) {
          this.setAttribute('disabled', '');
        }
        else {
          this.removeAttribute('disabled');
        }
      }

      get disabled() {
        return this.hasAttribute('disabled');
      }

      set name(value) {
        this.setAttribute('name', new String(value));
      }

      get name() {
        if (this.hasAttribute('name')) {
          return this.getAttribute('name');
        } else {
          return '';
        }
      }

      set form(value) {
        this._inputElement.form = value
        if (this._inputElement.hasAttribute('form')) {
          this.setAttribute('form', this._inputElement.getAttribute('form'));
        }
      }

      get form() {
        return this._inputElement.form;
      }

      set value(value) {
        this.setAttribute('value', new String(value));
      }

      get value() {
        if (this.hasAttribute('value')) {
          return this.getAttribute('value');
        } else {
          return 'on';
        }
      }

      get inputElement() {
        return this._inputElement;
      }

      attributeChangedCallback(name, oldValue, newValue) {
        const hasValue = newValue !== null;
        switch (name) {
          case 'pressed':
            this.setAttribute('aria-pressed', hasValue);
            break;

          case 'disabled':
            this.setAttribute('aria-disabled', hasValue);

            if (hasValue) {
              if (this.hasAttribute('tabindex')) {
                this._tabindexBeforeDisabled = this.getAttribute('tabindex');
                this.removeAttribute('tabindex');
                this.blur();
              }
            } else {
              if (!this.hasAttribute('tabindex') && this._tabindexBeforeDisabled !== undefined && this._tabindexBeforeDisabled !== null) {
                this.setAttribute('tabindex', this._tabindexBeforeDisabled);
              }
            }
            break;

          case 'name':
            this._inputElement.name = newValue;
            break;

          case 'value':
            this._inputElement.value = newValue;
            break;

          case 'form':
            this._inputElement.for = newValue;
            break;
        }
      }

      _onKeyDown(event) {
        if (event.altKey) {
          return;
        }

        switch (event.keyCode) {
          case KEYCODE.SPACE:
          case KEYCODE.ENTER:
            event.preventDefault();
            this._togglePressed();
            break;

          default:
            return;
        }
      }

      _onClick() {
        this._togglePressed();
      }

      _togglePressed() {
        if (this.disabled) {
          return;
        }

        this.pressed = !this.pressed;

        this.dispatchEvent(new CustomEvent('change', {
          detail: {
            pressed: this.pressed,
          },
          bubbles: true,
        }));
      }
    }

    window.CatalystElements.CatalystToggleButton = CatalystToggleButton;

    window.customElements.define(elementTagName, CatalystToggleButton);
  }

  if (window.CatalystElements.CatalystToggleButton === undefined) {
    if (window.WebComponents === undefined || window.WebComponents.ready) {
      createElement();
    }
    else {
      window.addEventListener('WebComponentsReady', () => {
        createElement();
      });
    }
  } else {
    console.warn('CatalystToggleButton has already been defined, cannot redefine.');
  }
})();
