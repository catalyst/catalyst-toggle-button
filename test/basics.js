/* eslint-disable no-unused-expressions, max-nested-callbacks */

/**
 * Basics suite.
 */
suite('Basics', () => {
  let element;

  /**
   * Called before each following test is run.
   */
  setup(() => {
    element = fixture('basic');
  });

  /**
   * Test the initial state of the element.
   */
  suite('Initial State', () => {
    /**
     * Test the attributes and properties of the element in it's initial state.
     */
    suite('Attributes & Properties', () => {
      /**
       * Test pressed.
       */
      test('pressed', () => {
        expect(element).to.have.property('pressed', false);
        expect(element.hasAttribute('pressed')).to.be.false;
      });
    });

    /**
     * Test the accessibility of the element in it's initial state.
     */
    suite('Accessibility', () => {
      /**
       * Test role.
       */
      test('role', () => {
        expect(element.hasAttribute('role'), '"role" missing').to.be.true;
        expect(element.getAttribute('role')).to.equal(
          'button',
          '"role" should be set to "button"'
        );
      });

      /**
       * Test tabindex.
       */
      test('tabindex', () => {
        expect(element.hasAttribute('tabindex'), '"tabindex" missing').to.be
          .true;
        expect(Number.parseInt(element.getAttribute('tabindex'), 10)).to.equal(
          0,
          '"tabindex" should be 0'
        );
      });

      /**
       * Test aria-pressed.
       */
      test('aria-pressed', () => {
        expect(element.hasAttribute('aria-pressed'), '"aria-pressed" missing')
          .to.be.true;
        expect(element.getAttribute('aria-pressed')).to.equal('false');
      });

      /**
       * Test aria-disabled.
       */
      test('aria-disabled', () => {
        expect(element.hasAttribute('aria-disabled'), '"aria-disabled" missing')
          .to.be.true;
        expect(element.getAttribute('aria-disabled')).to.equal('false');
      });
    });
  });

  /**
   * Test the attributes and properties of the element in it's initial state.
   */
  suite('Changing State', () => {
    /**
     * Mouse Interaction.
     */
    suite('Mouse Interaction', () => {
      /**
       * Test clicking the element.
       */
      test('Click Once', done => {
        let testRunning = true;

        // Change event needs to be fired.
        element.addEventListener('change', () => {
          if (testRunning) {
            testRunning = false;
            done();
          }
        });

        element.click();

        // Values that should change.
        expect(element.hasAttribute('pressed')).to.be.true;
        expect(element).to.have.property('pressed', true);
        expect(element.getAttribute('aria-pressed')).to.equal('true');

        setTimeout(() => {
          if (testRunning) {
            testRunning = false;
            assert(false, 'Change event was not fired within 10 ms.');
            done();
          }
        }, 10);
      });

      /**
       * Test clicking the element twice.
       */
      test('Click Twice', () => {
        element.click();
        element.click();

        expect(element.hasAttribute('pressed')).to.be.false;
        expect(element).to.have.property('pressed', false);
        expect(element.getAttribute('aria-pressed')).to.equal('false');
      });

      /**
       * Test clicking the element when disabled.
       */
      test('Click When Disabled', done => {
        let testRunning = true;
        element.disabled = true;

        // Change event should not be fired.
        element.addEventListener('change', () => {
          if (testRunning) {
            testRunning = false;
            assert(false, 'Change event should not be fired.');
            done();
          }
        });

        element.click();

        expect(element.hasAttribute('pressed')).to.be.false;
        expect(element).to.have.property('pressed', false);
        expect(element.getAttribute('aria-pressed')).to.equal('false');

        setTimeout(() => {
          if (testRunning) {
            testRunning = false;
            done();
          }
        }, 10);
      });
    });

    /**
     * KeyBoard Interaction.
     * TODO: write tests.
     */
    suite('KeyBoard Interaction', () => {});
  });
});
