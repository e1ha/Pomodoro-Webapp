const workingTime = 5;
const shortBreakTime = 2;
const longBreakTime = 4;
const pomob4break = 4;
let TASKS = [];
let myStorage = window.localStorage;
/* Function to count down the current timer
 *
 * @param {int} start time in milliseconds
 * @param {int} duration for this timer in milliseconds
 * @param {int} ID returned by setInterval, used by clearInterval
 * @param {int} the index of the current task in TASKS
 */
function countDown(start, duration, timerID, taskIndex) {
  // get the timer HTML element
  let element = document.getElementById('timer');
  // calculate the difference between current time
  // and start time in seconds
  let difference = duration - Math.floor((Date.now() - start) / 1000);
  // clearInterval and call sessionFinish once time is up
  if (difference < 0) {
    if (timerID != null) {
      clearInterval(timerID);
    }
    element.innerHTML = '00:00';
    sessionFinish(duration, taskIndex);
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
function startTimer(duration, taskIndex) {
  const start = Date.now();
  // call countDown first for initialization
  countDown(start, duration, null, taskIndex);
  // timer ID is used to clear the interval once the timer hits zero
  // call countDown for every 500 milliseconds
  var timerID = setInterval(function () {
    countDown(start, duration, timerID, taskIndex);
  }, 500);
}

/* Function to act as a callback when timer hits zero,
 * calculate pomos left and changing the background
 *
 * @param {int} the duration of the timer that hits zero
 * @param {numWork} number of work sessions done
 */
function sessionFinish(prevDuration, taskIndex) {
  let nextTask = taskIndex;
  let newDuration = 0;
  if (prevDuration === workingTime) {
    TASKS[taskIndex].pomosLeft = parseInt(TASKS[taskIndex].pomosLeft) - 1;
    document.getElementById('pomosleft').innerHTML =
      TASKS[nextTask].pomosLeft + ' pomos to go';
  }

  if (TASKS[taskIndex].pomosLeft == 0) {
    if (prevDuration == shortBreakTime || prevDuration == longBreakTime) {
      //TASKS[taskIndex].done = true;
      nextTask = taskIndex + 1;
      newDuration = workingTime;
      document.getElementById(
        'showTasks'
      ).innerHTML = `Active : ${TASKS[nextTask].taskName}`;
      refreshTasksList();
    } else {
      if (
        window.confirm('Would you like to add addtional time for this task?')
      ) {
        let addTime = '';
        do {
          addTime = window.prompt(
            'Please enter addtional SECONDS you need in whole numbers. ***For testing only***',
            '0'
          );
        } while (isNaN(parseInt(addTime)));

        // go to break if no time added
        if (addTime == null) {
          TASKS[taskIndex].done = true;
          nextTask = taskIndex + 1;
          if (nextTask >= TASKS.length) {
            document.getElementById('pomosleft').innerHTML = '0 pomos to go';
            alert(
              'Congratulations! You have finished all your tasks! Exiting timer.'
            );
            myStorage.setItem('done', '1');
            window.location.href = './../pages/tasks.html';
          }
          //document.getElementById('showTasks').innerHTML = `Active : ${TASKS[nextTask].taskName}`;
          nextTask -= 1;
          let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
          newDuration =
            pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
          //refreshTasksList();
        } else {
          // add additional time to the timer
          addTime = parseInt(addTime);
          if (addTime == 0) {
            TASKS[taskIndex].done = true;
            nextTask = taskIndex + 1;
            if (nextTask >= TASKS.length) {
              document.getElementById('pomosleft').innerHTML = '0 pomos to go';
              alert(
                'Congratulations! You have finished all your tasks! Exiting timer.'
              );
              myStorage.setItem('done', '1');
              window.location.href = './../pages/tasks.html';
            }
            //document.getElementById('showTasks').innerHTML = `Active : ${TASKS[nextTask].taskName}`;
            nextTask -= 1;
            let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
            newDuration =
              pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
          }
          let addPomos = Math.floor(addTime / workingTime);
          addPomos = addTime % workingTime > 0 ? addPomos + 1 : addPomos;

          // update min
          TASKS[taskIndex].min =
            parseInt(TASKS[taskIndex].min) + parseInt(addTime);
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
        // mark current task as done, active one extra break
        TASKS[taskIndex].done = true;
        nextTask = taskIndex + 1;
        // if next task dones't exist exit
        if (nextTask >= TASKS.length) {
          document.getElementById('pomosleft').innerHTML = '0 pomos to go';
          alert(
            'Congratulations! You have finished all your tasks! Exiting timer.'
          );
          myStorage.setItem('done', '1');
          window.location.href = './../pages/tasks.html';
        }
        nextTask -= 1;
        let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
        newDuration =
          pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
      }
    }
  } else {
    if (prevDuration == workingTime) {
      let pomosDone = TASKS[taskIndex].pomos - TASKS[taskIndex].pomosLeft;
      newDuration =
        pomosDone % pomob4break == 0 ? longBreakTime : shortBreakTime;
    } else {
      newDuration = workingTime;
    }
  }

  myStorage.setItem('tasks', JSON.stringify(TASKS));
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
  startTimer(newDuration, nextTask);
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

function refreshTasksList() {
  document.getElementById('tasks').innerHTML = '';
  TASKS.forEach((task) => {
    if (!task.done) {
      let taskElement = `<li><input type="text" name="task" class="task" value="${task.taskName}"/></li>`;
      document
        .getElementById('tasks')
        .insertAdjacentHTML('beforeend', taskElement);
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

// eslint-disable-next-line no-unused-vars
function taskPeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '0vh' || height == '') {
    document.getElementById('tasks').style.height = '2vh';
  }
}

// eslint-disable-next-line no-unused-vars
function taskUnpeak() {
  let height = document.getElementById('tasks').style.height;
  if (height == '2vh') {
    document.getElementById('tasks').style.height = '0vh';
  }
}

// load the tasks and current active task, then start timer
window.onload = () => {
  TASKS = JSON.parse(myStorage.getItem('tasks'));
  TASKS.forEach((task) => {
    task.pomosLeft = task.pomos;
    task.done = false;
  });
  refreshTasksList();
  document.getElementById(
    'showTasks'
  ).innerHTML = `Active : ${TASKS[0].taskName}`;
  document.getElementById('pomosleft').innerHTML =
    TASKS[0].pomosLeft + ' pomos to go';
  document.getElementById('timerdescription').innerHTML = 'Work Session';
  myStorage.setItem('tasks', JSON.stringify(TASKS));
  startTimer(workingTime, 0);
};
