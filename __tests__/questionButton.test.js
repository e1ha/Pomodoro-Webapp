const { redirectToInstructionsPage } = require('../src/scripts/buttons.js');

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

describe('onClickQuestionButton', () => {
  test('redirectToInstructionsPage', () => {
    redirectToInstructionsPage();
    expect(window.location.href).toBe('../pages/instructions.html');
  });
});
