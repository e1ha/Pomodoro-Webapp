const redirectToTasksPage = require('../src/scripts/instructions/instructions');

beforeEach(() => {
  global.window = Object.create(window);
  window.confirm = jest.fn(() => true);
  window.prompt = jest.fn(() => 0);
  window.alert = jest.fn(() => true);
  Object.defineProperty(window, 'location', {
    value: {
      href: '/'
    }
  });
});

describe('onClickContinueButton', () => {
  test('redirectToTasksPage', () => {
    redirectToTasksPage();
    expect(window.location.href).toBe('../pages/tasks.html');
  });
});
