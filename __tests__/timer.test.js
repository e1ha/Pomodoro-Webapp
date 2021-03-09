const timer = require('../src/scripts/timer/timer');

class LocalStorageMock {
  constructor() {
    this.stoarge = {};
  }

  clear() {
    this.stoarge = {};
  }

  getItem(key) {
    return this.stoarge[key] || null;
  }

  setItem(key, value) {
    this.stoarge[key] = String(value);
  }

  removeItem(key) {
    delete this.stoarge[key];
  }
}
global.localStorage = new LocalStorageMock();

describe('startTimer tests', () => {
  test('Check if timer starts with the correct duration', () => {
    document.body.innerHTML = `<p id="timer">00:00</p>`;
    const timerUI = document.getElementById('timer');
    let workingHTML = '25:00';
    let shortHTML = '05:00';
    let longHTML = '15:00';
    let durationTests = [25*60, 5*60, 15*60];
    let durationString = [workingHTML, shortHTML, longHTML]
    
    for (let i = 0; i < durationString.length; i++) {
        timer.startTimer(durationTests[i], 0);
        expect(timerUI.innerHTML).toMatch(durationString[i]);
    }
  });
});


describe('sessionFinish tests', () => {
  test('Test behavior of final task working session ends with short break and no addtional time', () => {
    const workingTime = 5;
    const shortBreakTime = 2;
    const longBreakTime = 4;
    const pomob4break = 4;
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
      <p id="pomosleft">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerdescription">
      <p id="timerdescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="EndSessionButton">End Session</button>
    </div>
  </body>
    `;
    const pomoUI = document.getElementById('pomosleft');
    const desUI =  document.getElementById('timerdescription');
    const myworkTimerBackground = document.getElementsByClassName(
      'workTimerBackground'
    )[0];
    const mypageBackground = document.getElementsByTagName('BODY')[0];
  
    const myEndSessionButton = document.getElementById('EndSessionButton');
    global.confirm = () => false;
    timer.sessionFinish(workingTime, 0, TASKS);
    expect(pomoUI.innerHTML).toMatch('0 pomos to go');
    expect(desUI.innerHTML).toMatch('Short Break');
    expect(TASKS[0].pomosLeft.toString()).toMatch('0');
  });


  test('Test behavior of final task working session ends with long break and no addtional time', () => {
    const workingTime = 5;
    const shortBreakTime = 2;
    const longBreakTime = 4;
    const pomob4break = 4;
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
      <p id="pomosleft">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerdescription">
      <p id="timerdescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="EndSessionButton">End Session</button>
    </div>
  </body>
    `;
    global.confirm = () => false;
    const pomoUI = document.getElementById('pomosleft');
    const desUI =  document.getElementById('timerdescription');
    const myworkTimerBackground = document.getElementsByClassName(
      'workTimerBackground'
    )[0];
    const mypageBackground = document.getElementsByTagName('BODY')[0];
  
    const myEndSessionButton = document.getElementById('EndSessionButton');
    timer.sessionFinish(workingTime, 0, TASKS);
    expect(pomoUI.innerHTML).toMatch('1 pomos to go');
    expect(desUI.innerHTML).toMatch('Long Break');
    expect(TASKS[0].pomosLeft.toString()).toMatch('1');
  });


  test('Test break ends followed by working session', () => {
    const workingTime = 5;
    const shortBreakTime = 2;
    const longBreakTime = 4;
    const pomob4break = 4;
    var TASKS = [];
    var task1 = {
      id: '01',
      taskName: 'test1',
      min: '25',
      pomos: 1,
      done: false,
      pomosLeft: 0
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
      <p id="pomosleft">3 pomos to go</p>
    </div>
    <div class="workTimerBackground">
      <p id="timer">25:00</p>
    </div>
    <div class="timerdescription">
      <p id="timerdescription">[timer/break]</p>
    </div>
    <div class="centerEndSessionButton">
      <button id="EndSessionButton">End Session</button>
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
    const desUI =  document.getElementById('timerdescription');
    timer.sessionFinish(shortBreakTime, 0, TASKS);
    expect(desUI.innerHTML).toMatch('Work Session');
    timer.sessionFinish(shortBreakTime, 1, TASKS);
    expect(desUI.innerHTML).toMatch('Work Session');

  });

});
