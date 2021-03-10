const endSession = require('../src/scripts/buttons/endSession.js');
const endButton = require(endSession());

beforeEach(() => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      href: '/'
    }
  });
});

describe('onClickEndSessionButton', () => {
  test('redirectToTasksPage', () => {
    document.body.innerHTML = `
        <button id="EndSessionButton">End Session</button>
    `;

    endSession();
    expect(window.location.href).toBe('../pages/tasks.html');
  });
});
