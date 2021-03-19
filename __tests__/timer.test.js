const timer = require('../src/scripts/timer/timer');
const workingTime = 25 * 60;
const shortBreakTime = 5 * 60;
const longBreakTime = 20 * 60;

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

class localStorageMock {
  constructor() {
    this.storage = {};
  }

  clear() {
    this.storage = {};
  }

  getItem(key) {
    return this.storage[key] || null;
  }

  setItem(key, value) {
    this.storage[key] = String(value);
  }

  removeItem(key) {
    delete this.storage[key];
  }
}

global.localStorage = new localStorageMock();

describe('startTimer tests', () => {
  test('Check if timer starts with the correct duration', () => {
    document.body.innerHTML = `<p id="timer">00:00</p>`;
    const timerUI = document.getElementById('timer');
    let workingHTML = '25:00';
    let shortHTML = '05:00';
    let longHTML = '20:00';
    let durationTests = [workingTime, shortBreakTime, longBreakTime];
    let durationString = [workingHTML, shortHTML, longHTML];

    for (let i = 0; i < durationString.length; i++) {
      timer.startTimer(durationTests[i], 0);
      expect(timerUI.innerHTML).toMatch(durationString[i]);
    }
  });
});

describe('sessionFinish tests', () => {
  test('Check behavior of final task working session ends with break and no addtional time', () => {
    var TASKS = [];
    var task1 = {
      id: '01',
      taskName: 'test1',
      min: '25',
      pomos: 1,
      done: false,
      pomosLeft: 1
    };
    var task2 = {
      id: '02',
      taskName: 'test2',
      min: '25',
      pomos: 4,
      done: false,
      pomosLeft: 1
    };
    TASKS.push(task1);
    TASKS.push(task2);
    localStorage.setItem('tasks', JSON.stringify(TASKS));
    document.body.innerHTML = `
    <body>
    <div class="pomos">
      <p id="pomosRemaining">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerDescription">
      <p id="timerDescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="endSessionButton">End Session</button>
    </div>
  </body>
    `;
    const pomoUI = document.getElementById('pomosRemaining');
    const desUI = document.getElementById('timerDescription');
    global.confirm = () => false;
    timer.sessionFinish(workingTime, 0, TASKS);
    expect(pomoUI.innerHTML).toMatch('0 pomos to go');
    expect(desUI.innerHTML).toMatch('Short Break');
    expect(TASKS[0].pomosLeft.toString()).toMatch('0');
    timer.sessionFinish(workingTime, 1, TASKS);

    expect(pomoUI.innerHTML).toMatch('0 pomos to go');
    expect(desUI.innerHTML).toMatch('Long Break');
    expect(TASKS[0].pomosLeft.toString()).toMatch('0');
  });

  test('Check behavior of final task working session ends with long break and no addtional time', () => {
    var TASKS = [];
    var task1 = {
      id: '01',
      taskName: 'test1',
      min: '25',
      pomos: 5,
      done: false,
      pomosLeft: 2
    };
    var task2 = {
      id: '02',
      taskName: 'test2',
      min: '25',
      pomos: 1,
      done: false,
      pomosLeft: 1
    };
    TASKS.push(task1);
    TASKS.push(task2);
    localStorage.setItem('tasks', JSON.stringify(TASKS));
    document.body.innerHTML = `
    <body>
    <div class="pomos">
      <p id="pomosRemaining">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerDescription">
      <p id="timerDescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="endSessionButton">End Session</button>
    </div>
  </body>
    `;
    global.confirm = () => false;
    const pomoUI = document.getElementById('pomosRemaining');
    const desUI = document.getElementById('timerDescription');
    timer.sessionFinish(workingTime, 0, TASKS);
    expect(pomoUI.innerHTML).toMatch('1 pomos to go');
    expect(desUI.innerHTML).toMatch('Long Break');
    expect(TASKS[0].pomosLeft.toString()).toMatch('1');
  });

  test('Check break ends followed by working session', () => {
    var TASKS = [];
    var task1 = {
      id: '01',
      taskName: 'test1',
      min: '25',
      pomos: 2,
      done: false,
      pomosLeft: 1
    };
    var task2 = {
      id: '02',
      taskName: 'test2',
      min: '25',
      pomos: 5,
      done: false,
      pomosLeft: 1
    };
    TASKS.push(task1);
    TASKS.push(task2);
    localStorage.setItem('tasks', JSON.stringify(TASKS));
    document.body.innerHTML = `
    <body>
    <div class="pomos">
      <p id="pomosRemaining">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerDescription">
      <p id="timerDescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="endSessionButton">End Session</button>
    </div>
    <div class="tasksListContainer">
      <button
        id="showTasks"
        onclick="displayTasks()"
        onmouseover="taskPeak()"
        onmouseout="taskUnpeak()"
      >
        None
      </button>
      <div class="tasksContainer">
      <ul class="tasks" id="tasks"></ul>
      </div>
    </div>
  </body>
    `;
    const pomoUI = document.getElementById('pomosRemaining');
    const desUI = document.getElementById('timerDescription');
    timer.sessionFinish(shortBreakTime, 0, TASKS);
    expect(TASKS[0].pomosLeft.toString()).toMatch('1');
    expect(pomoUI.innerHTML).toMatch('1 pomos to go');
    expect(desUI.innerHTML).toMatch('Work Session');
    timer.sessionFinish(longBreakTime, 1, TASKS);
    expect(TASKS[1].pomosLeft.toString()).toMatch('1');
    expect(pomoUI.innerHTML).toMatch('1 pomos to go');
    expect(desUI.innerHTML).toMatch('Work Session');
  });
});
