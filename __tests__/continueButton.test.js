const redirectToTasksPage = require('../src/scripts/buttons/continueButton.js');

beforeEach(() => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      href: '/'
    }
  });
});

describe('onClickContinueButton', () => {
  test('redirectToTasksPage', () => {
    document.body.innerHTML = `
        <button id="continueButton">Continue</button>
    `;

    redirectToTasksPage();
    expect(window.location.href).toBe('../pages/tasks.html');
  });
});
