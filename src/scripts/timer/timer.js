const workingTime = 5;
const shortBreakTime = 2;
const longBreakTime = 4;
const pomob4break = 4;
let currTask = 0;
let totalPomos = 0;
let totalPomosLeft = 0;
let pomosFinished = 0;
let progress = 0;
let distractions = 0;
let doneClicked = false;
let skipAdd = false;

/* Function to count down the current timer
 *
 * @param {int} start time in milliseconds
 * @param {int} duration for this timer in milliseconds
 * @param {int} ID returned by setInterval, used by clearInterval
 * @param {int} the index of the current task in TASKS
 * @param {array} the array containing all the task objects
 */
function countDown(start, duration, timerID, taskIndex, TASKS) {
  // get the timer HTML element
  let element = document.getElementById('timer');
  // calculate the difference between current time
  // and start time in seconds
  let difference = duration - Math.floor((Date.now() - start) / 1000);
  if (doneClicked && duration == workingTime) {
    doneClicked = false;
    difference = -1;
    TASKS[taskIndex].pomosLeft = 1;
  }
  // clearInterval and call sessionFinish once time is up
  updateProgressBar(TASKS);
  if (difference < 0) {
    if (timerID != null) {
      clearInterval(timerID);
    }
    if (duration == workingTime) {
      pomosFinished = pomosFinished + 1;
    }
    element.innerHTML = '00:00';
    sessionFinish(duration, taskIndex, TASKS);
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
 * @param {array} the array containing all the task objects
 */
function startTimer(duration, taskIndex, TASKS) {
  const start = Date.now();
  // call countDown first for initialization
  countDown(start, duration, null, taskIndex, TASKS);
  // timer ID is used to clear the interval once the timer hits zero
  // call countDown for every 500 milliseconds
  var timerID = setInterval(function () {
    countDown(start, duration, timerID, taskIndex, TASKS);
  }, 500);
}

/* Function to act as a callback when timer hits zero,
 * calculate pomos left and changing the background
 *
 * @param {int} the duration of the timer that hits zero
 * @param {numWork} number of work sessions done
 * @param {array} the array containing all the task objects
 */
function sessionFinish(prevDuration, taskIndex, TASKS) {
  let nextTask = taskIndex;
  let newDuration = 0;
  if (prevDuration === workingTime) {
    TASKS[taskIndex].pomosLeft = parseInt(TASKS[taskIndex].pomosLeft) - 1;
    document.getElementById('pomosleft').innerHTML =
      TASKS[nextTask].pomosLeft + ' pomos to go';
  }

  // if no more working sessions left for current task
  if (TASKS[taskIndex].pomosLeft == 0) {
    // if the user has already had the final break
    if (prevDuration == shortBreakTime || prevDuration == longBreakTime) {
      // move to next task, refresh the task list display as well
      nextTask = taskIndex + 1;
      newDuration = workingTime;
      document.getElementById(
        'showTasks'
      ).innerHTML = `Active : ${TASKS[nextTask].taskName}`;
      currTask = TASKS[nextTask].id;
      refreshTasksList(TASKS);
    } else {
      // if the user just finishes the last working session
      if (
        !skipAdd &&
        window.confirm('Would you like to add addtional time for this task?')
      ) {
        // ask the user to input valid addtional time
        let addTime = '';
        do {
          addTime = window.prompt(
            'Please enter additional SECONDS you need in whole numbers. ***For testing only***'
          );
        } while (
          (addTime != null && isNaN(parseInt(addTime))) ||
          (addTime != null && parseInt(addTime) < 0)
        );

        // go to the final break if no additional time added
        if (addTime == null || parseInt(addTime) == 0) {
          TASKS[taskIndex].done = true;
          nextTask = taskIndex + 1;
          // if the finished task is the final task redirect the user back to landing page
          if (nextTask >= TASKS.length) {
            document.getElementById('pomosleft').innerHTML = '0 pomos to go';
            //alert('Congratulations! You have finished all your tasks! Exiting timer.');
            localStorage.setItem('done', '1');
            //window.location.href = './../pages/tasks.html';
            showAnalysis();
          }
          // calculate the final break duration
          nextTask -= 1;
          let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
          newDuration =
            pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
        } else {
          // add additional time and pomos to the timer
          let addedTime = parseInt(addTime);
          let addPomos = Math.floor(addedTime / workingTime);
          addPomos = addedTime % workingTime > 0 ? addPomos + 1 : addPomos;

          // update min
          TASKS[taskIndex].min = parseInt(TASKS[taskIndex].min) + addedTime;
          // update pomos
          TASKS[taskIndex].pomos = parseInt(TASKS[taskIndex].pomos) + addPomos;
          // update pomos left
          TASKS[taskIndex].pomosLeft = addPomos;

          // calculate whether the next break is a short break or long break
          let pomosDone =
            parseInt(TASKS[taskIndex].pomos) -
            parseInt(TASKS[taskIndex].pomosLeft);
          newDuration =
            pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
        }
      } else {
        // if the user doesn't wish to add more time
        skipAdd = false;
        TASKS[taskIndex].done = true;
        nextTask = taskIndex + 1;
        // if the finished task is the final task redirect the user back to landing page
        if (nextTask >= TASKS.length) {
          document.getElementById('pomosleft').innerHTML = '0 pomos to go';
          //alert('Congratulations! You have finished all your tasks! Exiting timer.');
          localStorage.setItem('done', '1');
          //window.location.href = './../pages/tasks.html';
          showAnalysis();
        }
        nextTask -= 1;
        let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
        newDuration =
          pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
      }
    }
  } else {
    // if there are more working sessions left for current task
    if (prevDuration == workingTime) {
      // determine if it's a long break or a short break
      let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
      newDuration =
        pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
    } else {
      newDuration = workingTime;
    }
  }

  // update local storage
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  document.getElementById('pomosleft').innerHTML =
    TASKS[nextTask].pomosLeft + ' pomos to go';

  // change the page background based on the next timer session type
  let workTimerBackground = document.getElementsByClassName(
    'workTimerBackground'
  )[0];
  let pageBackground = document.getElementsByTagName('BODY')[0];

  let EndSessionButton = document.getElementById('EndSessionButton');

  if (newDuration == longBreakTime) {
    document.getElementById('timerdescription').innerHTML = 'Long Break';
    //long break timer background
    workTimerBackground.style.backgroundColor = '#adffd1';
    //long break page background
    pageBackground.style.backgroundColor = '#47de88';
    EndSessionButton.style.backgroundColor = '#47de88';
  } else if (newDuration == shortBreakTime) {
    document.getElementById('timerdescription').innerHTML = 'Short Break';
    //short break timer background
    workTimerBackground.style.backgroundColor = '#6ea3ff';
    pageBackground.style.backgroundColor = '#36a1ff';
    EndSessionButton.style.backgroundColor = '#36a1ff';
  } else if (newDuration == workingTime) {
    document.getElementById('timerdescription').innerHTML = 'Work Session';
    //work break timer background
    workTimerBackground.style.backgroundColor = '#ffb5b5';
    pageBackground.style.backgroundColor = '#ff6767';
    EndSessionButton.style.backgroundColor = '#ff6767';
  }

  // start the next session timer
  if (TASKS) {
    refreshTasksList(TASKS);
  }
  startTimer(newDuration, nextTask, TASKS);
}

// eslint-disable-next-line no-unused-vars
function displayTasks() {
  let height = document.getElementById('tasks').style.height;
  if (height != '30vh') {
    document.getElementById('tasks').style.height = '30vh';
  } else {
    document.getElementById('tasks').style.height = '0vh';
  }
}

function updateProgressBar(list) {
  totalPomos = 0;
  totalPomosLeft = 0;
  if (list) {
    list.forEach((task) => {
      totalPomos = totalPomos + task.pomos;
      totalPomosLeft = totalPomosLeft + task.pomosLeft;
    });
  }
  progress = Math.round(100 * ((totalPomos - totalPomosLeft) / totalPomos));
  if (document.getElementById('progressBar')) {
    document.getElementById('progressBar').style.width = `${progress}%`;
  }
}

function showDone() {
  document.querySelector('.active-task').innerHTML = 'Done';
  document.querySelector('.active-task').style.color = 'white';
  document.querySelector('.active-task').style.fontWeight = 'bold';
}

function hideDone(name) {
  document.querySelector('.active-task').innerHTML = name;
  document.querySelector('.active-task').style.color = 'black';
  document.querySelector('.active-task').style.fontWeight = 'normal';
}

function refreshTasksList(TASKS) {
  var tasksList = document.getElementById('tasks');
  if (tasksList) {
    document.getElementById('tasks').innerHTML = '';
    TASKS.forEach((task) => {
      if (!task.done) {
        let taskElement = `<li>
                            <p id="task-${task.id}" class="task">${task.taskName}</p>
                          </li>`;
        if (currTask == task.id) {
          taskElement = `<li>
          <p id="task-${task.id}" class="task active-task">${task.taskName}</p>
                          </li>`;
        }
        document
          .getElementById('tasks')
          .insertAdjacentHTML('beforeend', taskElement);
        if (currTask == task.id) {
          document
            .getElementById(`task-${task.id}`)
            .addEventListener('click', () => {
              doneTask();
            });
          document
            .getElementById(`task-${task.id}`)
            .addEventListener('mouseover', showDone, false);
          document.getElementById(`task-${task.id}`).addEventListener(
            'mouseout',
            function () {
              hideDone(task.taskName);
            },
            false
          );
        }
      }
    });
    TASKS.forEach((task) => {
      if (task.done) {
        let taskElement = `<li><input type="text" name="task" class="task-done" value="${task.taskName}"/></li>`;
        document
          .getElementById('tasks')
          .insertAdjacentHTML('beforeend', taskElement);
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
function taskPeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '0vh' || height == '') {
    document.getElementById('tasks').style.height = '2vh';
  }
}

function doneTask() {
  doneClicked = true;
  skipAdd = true;
}

// eslint-disable-next-line no-unused-vars
function taskUnpeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '2vh') {
    document.getElementById('tasks').style.height = '0vh';
  }
}

function endSession() {
  //alert('You have ended the session. Returning to the task page...');
  window.location.href = '../pages/tasks.html';
}

function distractionButtonFunc() {
  distractions = distractions + 1;
}

function showAnalysis() {
  var analysis = document.getElementById('analysis');
  if (analysis) {
    analysis.style.display = 'block';
    var distractElem = document.getElementById('distractionsAnalysis');
    distractElem.innerHTML = `You were distracted a total of ${distractions} times.`;
    var pomosEstElem = document.getElementById('pomosEst');
    pomosEstElem.innerHTML = `You estimated that you would take ${totalPomos} pomos (${
      totalPomos * workingTime
    } mins).`;
    var pomosDoneElem = document.getElementById('pomosAnalysis');
    pomosDoneElem.innerHTML = `You actually took ${pomosFinished} pomos (${
      pomosFinished * workingTime
    } mins)!`;
  }
}

// load the tasks and current active task, then start timer
window.onload = () => {
  var finishButton = document.getElementById('finishButton');
  finishButton.addEventListener('click', endSession);
  var distractionButton = document.getElementById('distractionButton');
  distractionButton.addEventListener('click', distractionButtonFunc);
  var endButton = document.getElementById('EndSessionButton');
  endButton.addEventListener('click', endSession);
  var TASKS = JSON.parse(localStorage.getItem('tasks'));
  TASKS.forEach((task) => {
    task.pomosLeft = task.pomos;
    task.done = false;
  });
  currTask = TASKS[0].id;
  refreshTasksList(TASKS);
  document.getElementById(
    'showTasks'
  ).innerHTML = `Active : ${TASKS[0].taskName}`;
  document.getElementById('pomosleft').innerHTML =
    TASKS[0].pomosLeft + ' pomos to go';
  document.getElementById('timerdescription').innerHTML = 'Work Session';
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  startTimer(workingTime, 0, TASKS);
};

module.exports = { startTimer, countDown, sessionFinish };
