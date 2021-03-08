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
    test('Check if timer starts with the correct duration', () => {
        
    });
  });

/*
let task = {
    id: '0123',
    taskName: 'test',
    min: '25',
    pomos: 1,
    done: false
};

let TASKS = [];
TASKS.push(task);
*/