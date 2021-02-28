const workingTime = 5;
const shortBreakTime = 2;
const longBreakTime = 4;
const pomob4break = 4;

/* Function to count down the current timer
 *
 * @param {int} start time in milliseconds
 * @param {int} duration for this timer in milliseconds
 * @param {int} ID returned by setInterval, used by clearInterval
 * @param {numWork} number of work sessions done
 * @param {function} callback function to use when timer hits zero
 */
function countDown(start, duration, timerID, numWork, callback) {
  // get the timer HTML element
  let element = document.getElementById('timer');
  // calculate the difference between current time
  // and start time in seconds
  let difference = duration - Math.floor((Date.now() - start) / 1000);
  // clearInterval and call callback once time is up
  if (difference < 0) {
    clearInterval(timerID);
    element.innerHTML = '00:00';
    callback(duration, numWork);
    return;
  }
  // converts the differnece in seconds to minutes and seconds
  let minutes = Math.floor(difference / 60);
  let seconds = Math.floor(difference % 60);
  // take the absolute value of minutes and seconds for safe measures
  minutes = minutes < 0 ? 0 : minutes;
  seconds = seconds < 0 ? 0 : seconds;
  // formate the minutes and seconds to two digit string
  minutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  seconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  element.innerHTML = minutes + ':' + seconds;
}

/* Function to start a new timer instance
 *
 * @param {int} duration for this timer in milliseconds
 * @param {numWork} number of work sessions done
 * @param {function} callback function to use when timer hits zero
 */
function startTimer(duration, numWork, callback) {
  const start = Date.now();
  // call countDown first for initialization
  countDown(start, duration, null, numWork, callback);
  // timer ID is used to clear the interval once the timer hits zero
  // call countDown for every 500 milliseconds
  var timerID = setInterval(function () {
    countDown(start, duration, timerID, numWork, callback);
  }, 500);
}

/* Function to act as a callback when timer hits zero,
 * calculate pomos left and changing the background
 *
 * @param {int} the duration of the timer that hits zero
 * @param {numWork} number of work sessions done
 */
function sessionFinish(prevDuration, numWork) {
  // determine the duration for the next timer based on whether
  // the next timer should be a work timer, short break timer or
  // a long break timer based on numWork and prevDuration
  let newDuration = 0;
  let pomos = document.getElementById('pomosleft');
  let newnumWork = numWork;

  if (prevDuration == workingTime && numWork == pomob4break - 1) {
    newDuration = longBreakTime;
    pomos.innerHTML = parseInt(pomos.innerHTML) - 1;
    newnumWork = 0;
  } else if (prevDuration == workingTime) {
    newDuration = shortBreakTime;
    newnumWork = numWork + 1;
    pomos.innerHTML = parseInt(pomos.innerHTML) - 1;
  } else {
    newDuration = workingTime;
  }

  // if no more pomos left, simply return for now
  // TODO: Check if there are more tasks to be done in localStorage,
  //       if not, alert the user and go back to tasks page
  if (parseInt(pomos.innerHTML) == 0) {
    return;
  }

  // change the page background based on the next timer session type
  let workTimerBackground = document.getElementsByClassName(
    'workTimerBackground'
  )[0];
  let pageBackground = document.getElementsByTagName('BODY')[0];

  let EndSessionButton = document.getElementById('EndSessionButton');

  let tasksList = document.getElementsByClassName('task');

  if (newDuration == longBreakTime) {
    //long break timer background
    workTimerBackground.style.backgroundColor = '#adffd1';
    //long break page background
    pageBackground.style.backgroundColor = '#47de88';
    EndSessionButton.style.backgroundColor = '#47de88';

    for (let taskNum = 0; taskNum < tasksList.length; taskNum++) {
      tasksList[taskNum].style.backgroundColor = '#47de88';
    }
  } else if (newDuration == shortBreakTime) {
    //short break timer background
    workTimerBackground.style.backgroundColor = '#6ea3ff';
    pageBackground.style.backgroundColor = '#36a1ff';
    EndSessionButton.style.backgroundColor = '#36a1ff';

    for (let taskNum = 0; taskNum < tasksList.length; taskNum++) {
      tasksList[taskNum].style.backgroundColor = '#36a1ff';
    }
  } else if (newDuration == workingTime) {
    //work break timer background
    workTimerBackground.style.backgroundColor = '#ffb5b5';
    pageBackground.style.backgroundColor = '#ff6767';
    EndSessionButton.style.backgroundColor = '#ff6767';
    tasksList[0].style.backgroundColor = '#ff6767';

    for (let taskNum = 0; taskNum < tasksList.length; taskNum++) {
      tasksList[taskNum].style.backgroundColor = '#ff6767';
    }
  }

  // start the next session timer
  startTimer(newDuration, newnumWork, sessionFinish);
}

// placeholder code for activating the timer
// TODO: Get the pomos for the first task from localStorage
var myStorage = window.localStorage;
myStorage.setItem('pomos', '5');
window.onload = function () {
  let pomos = myStorage.getItem('pomos');
  document.getElementById('pomosleft').innerHTML = pomos;
  startTimer(5, 0, sessionFinish);
};
