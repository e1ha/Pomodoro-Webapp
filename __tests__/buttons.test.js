const buttons = require('../src/scripts/buttons.js');

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

describe('Task Page Tests', () => {
  //check if alert is sent for ( empty string, non number, too big, too little, no task)
  /*beforeEach(() => {
    global.window = Object.create(window);
    window.confirm = jest.fn(() => true)
    window.prompt = jest.fn(() => 0)
    window.alert = jest.fn(() => true)
    Object.defineProperty(window, 'location', {
      value: {
        href: '/'
      }
    });
});*/

  test('check if invalid input triggers alert', () => {
    // no task
    document.body.innerHTML = `
		<ul class="tasksList" id="tasksList"></ul>
		<button id="startButton">Start</button>
	    `;

    let tasks = [];
    expect(buttons.calculateTotalTime(tasks)).toBe(false);

    // empty time
    let task1 = { id: '1', taskName: '', min: '', pomos: 0, done: false };
    tasks.push(task1);
    expect(buttons.calculateTotalTime(tasks)).toBe(false);

    // not number time
    task1 = { id: '1', taskName: '', min: 'A', pomos: 0, done: false };
    tasks.push(task1);
    expect(buttons.calculateTotalTime(tasks)).toBe(false);

    // less than 1min
    task1 = { id: '1', taskName: '', min: '-2', pomos: 0, done: false };
    tasks.push(task1);
    expect(buttons.calculateTotalTime(tasks)).toBe(false);

    // more than 180min
    task1 = { id: '1', taskName: '', min: '200', pomos: 0, done: false };
    tasks.push(task1);
    expect(buttons.calculateTotalTime(tasks)).toBe(false);
  });

  test('redirect to work timer page', () => {
    document.body.innerHTML = `
			<ul class="tasksList" id="tasksList"></ul>
            <button id="startButton">Start</button>
        `;
    let tasks = [];
    let task1 = { id: '1', taskName: '', min: '5', pomos: 1, done: false };
    tasks.push(task1);
    expect(buttons.calculateTotalTime(tasks)).toBe(true);
    buttons.startSession(tasks);
    expect(window.location.href).toBe('./../pages/timer.html');
  });
}); //end of task page tests

/*describe('onClickQuestionButton', () => {
  test('redirectToInstructionsPage', () => {
    redirectToInstructionsPage();
    expect(window.location.href).toBe('../pages/instructions.html');
  });
});*/
