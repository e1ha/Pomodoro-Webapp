const MINUTESTOSECONDS = 60;
const workingTime = 25 * MINUTESTOSECONDS;
const shortBreakTime = 5 * MINUTESTOSECONDS;
const longBreakTime = 20 * MINUTESTOSECONDS;
const pomob4break = 4;
let currTask = 0;
let totalPomos = 0;
let totalPomosLeft = 0;
let pomosFinished = 0;
let progress = 0;
let distractions = 0;
let doneClicked = false;
let skipAdd = false;
let currDuration = '';

/**
 * Runs the following code on window load
 */
window.onload = () => {
  var finishButton = document.getElementById('finishButton');
  finishButton.addEventListener('click', endSession);

  var distractionButton = document.getElementById('distractionButton');
  distractionButton.addEventListener('click', distractionButtonFunc);

  var endButton = document.getElementById('endSessionButton');
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
  document.getElementById('pomosRemaining').innerHTML =
    TASKS[0].pomosLeft + ' pomos to go';
  document.getElementById('timerDescription').innerHTML = 'Work Session';
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  startTimer(workingTime, 0, TASKS);
};

/**
 * Function to count down the current timer
 *
 * @param {int} start time in milliseconds
 * @param {int} duration for this timer in milliseconds
 * @param {int} timerID returned by setInterval, used by clearInterval
 * @param {int} taskIndex index of the current task in TASKS
 * @param {array} TASKS array containing all the task objects
 */
function countDown(start, duration, timerID, taskIndex, TASKS) {
  currDuration = duration;

  // Gets the timer HTML element
  let element = document.getElementById('timer');

  // Calculates the difference between current time and start time in seconds
  let difference = duration - Math.floor((Date.now() - start) / 1000);

  // Set the pomosLeft to 1 for the current session if the doneButton was clicked
  if (doneClicked && duration == workingTime) {
    doneClicked = false;
    alert(
      'Please continue reviewing your work until your current Pomodoro session ends.'
    );
    TASKS[taskIndex].pomosLeft = 1;
    document.getElementById('pomosRemaining').innerHTML = '1 pomos to go';
  }

  // Updates the progress bar every count
  updateProgressBar(TASKS);

  // Calls clearInterval and sessionFinish once time is up
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

  // Converts the difference in seconds to minutes and seconds
  let minutes = Math.floor(difference / 60);
  let seconds = Math.floor(difference % 60);

  // Takes the absolute value of minutes and seconds
  minutes = minutes < 0 ? 0 : minutes;
  seconds = seconds < 0 ? 0 : seconds;

  // Formats the minutes and seconds to two digit string
  minutes = minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  seconds = seconds.toLocaleString('en-US', {
    minimumIntegerDigits: 2
  });
  element.innerHTML = minutes + ':' + seconds;
}

/**
 * Function to start a new timer instance
 *
 * @param {int} duration for this timer in milliseconds
 * @param {int} taskIndex index of the active task
 * @param {*} TASKS array containing all the task objects
 */
function startTimer(duration, taskIndex, TASKS) {
  const start = Date.now();

  // Calls countDown for initialization
  countDown(start, duration, null, taskIndex, TASKS);

  // Call countDown every 500 milliseconds
  var timerID = setInterval(function () {
    countDown(start, duration, timerID, taskIndex, TASKS);
  }, 500);
}

/**
 * Function to act as a callback when timer hits zero,
 * calculates pomos left and changes the html based off of current session
 *
 * @param {int} prevDuration duration of the timer that hits zero
 * @param {int} taskIndex index of the active task
 * @param {*} TASKS array containing all the task objects
 */
function sessionFinish(prevDuration, taskIndex, TASKS) {
  let nextTask = taskIndex;
  let newDuration = 0;
  if (prevDuration === workingTime) {
    TASKS[taskIndex].pomosLeft = parseInt(TASKS[taskIndex].pomosLeft) - 1;
    document.getElementById('pomosRemaining').innerHTML =
      TASKS[nextTask].pomosLeft + ' pomos to go';
  }

  // If no more working sessions left for current task
  if (TASKS[taskIndex].pomosLeft == 0) {
    // If the user has already had the final break move to next task, refresh the task list display as well
    if (prevDuration == shortBreakTime || prevDuration == longBreakTime) {
      nextTask = taskIndex + 1;
      newDuration = workingTime;
      document.getElementById(
        'showTasks'
      ).innerHTML = `Active : ${TASKS[nextTask].taskName}`;
      currTask = TASKS[nextTask].id;
      refreshTasksList(TASKS);
    } else {
      // If the user just finishes the last working session
      if (
        !skipAdd &&
        window.confirm('Would you like to add addtional time for this task?')
      ) {
        // Ask the user to input valid addtional time
        let addTime = '';
        do {
          addTime = window.prompt(
            'Please enter additional minutes you need in whole numbers.'
          );
        } while (
          (addTime != null && isNaN(parseInt(addTime))) ||
          (addTime != null && parseInt(addTime) < 0)
        );

        // Go to the final break if no additional time is added
        if (addTime == null || parseInt(addTime) == 0) {
          TASKS[taskIndex].done = true;
          nextTask = taskIndex + 1;

          // If the finished task is the final task redirect the user back to landing page
          if (nextTask >= TASKS.length) {
            document.getElementById('pomosRemaining').innerHTML =
              '0 pomos to go';
            localStorage.setItem('done', '1');
            showAnalysis();
          }

          // Calculate the final break duration
          nextTask -= 1;
          let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
          newDuration =
            pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
        } else {
          // Add additional time and pomos to the timer
          let addedTime = parseInt(addTime);
          let addPomos = Math.floor(
            (addedTime * MINUTESTOSECONDS) / workingTime
          );
          addPomos =
            (addedTime * MINUTESTOSECONDS) % workingTime > 0
              ? addPomos + 1
              : addPomos;

          // Update min
          TASKS[taskIndex].min = parseInt(TASKS[taskIndex].min) + addedTime;
          // Update pomos
          TASKS[taskIndex].pomos = parseInt(TASKS[taskIndex].pomos) + addPomos;
          // Update pomos left
          TASKS[taskIndex].pomosLeft = addPomos;

          // Calculate whether the next break is a short break or long break
          let pomosDone =
            parseInt(TASKS[taskIndex].pomos) -
            parseInt(TASKS[taskIndex].pomosLeft);
          newDuration =
            pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
        }
      } else {
        // If the user doesn't wish to add more time
        skipAdd = false;
        TASKS[taskIndex].done = true;
        nextTask = taskIndex + 1;

        // If the finished task is the final task redirect the user back to landing page
        if (nextTask >= TASKS.length) {
          document.getElementById('pomosRemaining').innerHTML = '0 pomos to go';
          localStorage.setItem('done', '1');
          showAnalysis();
        }

        nextTask -= 1;
        let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
        newDuration =
          pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
      }
    }
  } else {
    // If there are more working sessions left for current task
    if (prevDuration == workingTime) {
      // Determine if it's a long break or a short break
      let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
      newDuration =
        pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
    } else {
      newDuration = workingTime;
    }
  }

  // Update local storage
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  document.getElementById('pomosRemaining').innerHTML =
    TASKS[nextTask].pomosLeft + ' pomos to go';

  // Change the page background based on the next timer session type
  let workTimerBackground = document.getElementsByClassName(
    'workTimerBackground'
  )[0];
  let pageBackground = document.getElementsByTagName('BODY')[0];

  let endSessionButton = document.getElementById('endSessionButton');

  if (newDuration == longBreakTime) {
    document.getElementById('timerDescription').innerHTML = 'Long Break';
    // Long break timer background
    workTimerBackground.style.backgroundColor = '#adffd1';
    // Long break page background
    pageBackground.style.backgroundColor = '#47de88';
    endSessionButton.style.backgroundColor = '#47de88';
  } else if (newDuration == shortBreakTime) {
    document.getElementById('timerDescription').innerHTML = 'Short Break';
    // Short break timer background
    workTimerBackground.style.backgroundColor = '#6ea3ff';
    pageBackground.style.backgroundColor = '#36a1ff';
    endSessionButton.style.backgroundColor = '#36a1ff';
  } else if (newDuration == workingTime) {
    document.getElementById('timerDescription').innerHTML = 'Work Session';
    // Work break timer background
    workTimerBackground.style.backgroundColor = '#ffb5b5';
    pageBackground.style.backgroundColor = '#ff6767';
    endSessionButton.style.backgroundColor = '#ff6767';
  }

  // Start the next session timer
  if (TASKS) {
    refreshTasksList(TASKS);
  }
  startTimer(newDuration, nextTask, TASKS);
}
/**
 * Function to display the task list component
 */
function displayTasks() {
  let height = document.getElementById('tasks').style.height;
  if (height != '30vh') {
    document.getElementById('tasks').style.height = '30vh';
  } else {
    document.getElementById('tasks').style.height = '0vh';
  }
}

/**
 * Function calculates totalPomos and totalPomosLeft
 * to update the progress bar
 *
 * @param {*} list list of all the task objects
 */
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

/**
 * Animation and styling when hovering over the active task
 */
function showDone() {
  if (currDuration == workingTime) {
    document.querySelector('.active-task').innerHTML = 'Done';
    document.querySelector('.active-task').style.backgroundColor = '#9bd89b';
    document.querySelector('.active-task').style.color = 'white';
    document.querySelector('.active-task').style.fontWeight = 'bold';
  } else {
    document.querySelector('.active-task').innerHTML =
      'Please wait till the break is over.';
    document.querySelector('.active-task').style.backgroundColor = '#f08686';
    document.querySelector('.active-task').style.color = 'white';
    document.querySelector('.active-task').style.fontWeight = 'bold';
  }
}
function hideDone(name) {
  document.querySelector('.active-task').innerHTML = name;
  document.querySelector('.active-task').style.backgroundColor = 'white';
  document.querySelector('.active-task').style.color = 'black';
  document.querySelector('.active-task').style.fontWeight = 'normal';
}

/**
 * Function updates the task list
 * based off of whether or not the task is done
 *
 * @param {*} TASKS list of all the task objects
 */
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

/**
 * Animation for task list hover
 */
function taskPeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '0vh' || height == '') {
    document.getElementById('tasks').style.height = '2vh';
  }
}

/**
 * Animation for task list hover
 */
function taskUnpeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '2vh') {
    document.getElementById('tasks').style.height = '0vh';
  }
}

/**
 * Function for when doneButton is clicked
 */
function doneTask() {
  if (currDuration == workingTime) {
    doneClicked = true;
    skipAdd = true;
  }
}

/**
 *  Function to redirect back to the tasks page
 */
function endSession() {
  let yesEnd = confirm('Are you sure you want to end the session?');
  if (yesEnd) {
    window.location.href = '../pages/tasks.html';
  }
}

/**
 *  Function adds 1 to distractions
 */
function distractionButtonFunc() {
  distractions = distractions + 1;
}

/**
 * Function displays the analysis modal at the end of the session
 */
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

module.exports = {
  startTimer,
  countDown,
  sessionFinish,
  endSession,
  displayTasks,
  taskPeak,
  taskUnpeak
};
