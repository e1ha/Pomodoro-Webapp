const { endSession } = require('../src/scripts/timer/timer');

beforeEach(() => {
  global.window = Object.create(window);
  window.alert = jest.fn(() => true);
  Object.defineProperty(window, 'location', {
    value: {
      href: '/'
    }
  });
});

describe('onClickEndSessionButton', () => {
  test('redirectToTasksPage', () => {
    document.body.innerHTML = `
        <button id="endSessionButton">End Session</button>
    `;

    endSession();
    expect(window.location.href).toBe('../pages/tasks.html');
  });
});
