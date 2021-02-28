/********************************************
 The start button 
 starts the timer, initiate duration
 switches pages to timer page
 Hello
 ?finalize task list (not sure about this one)
 *********************************************/

var startButton = document.getElementById('startButton');
var addTaskBtn = document.getElementById('addTaskBtn');
startButton.addEventListener('click', startSession, false);
addTaskBtn.addEventListener('click', updateTimes, false);

var taskTime = [];
var taskName = [];
var tasks = [];

//updates the arrays for new input values
function updateTimes() {
  taskTime = document.getElementsByClassName('taskTime animation-create-time');
  taskName = document.getElementsByClassName('task animation-create-task');
}

//var ring = document.getElementById('ring');

//loops through task list and calculates total time
function calculateTotalTime() {
  if (taskTime.length < 1) {
    alert('no tasks');
    return false;
  }

  for (let i = 0; i < taskTime.length; ++i) {
    let minPerTask = taskTime[i].value;

    minPerTask = parseInt(minPerTask); //covert input to number

    //task object for storage
    let task = {
      id: taskName[i].parentElement.id,
      name: taskName[i].value,
      time: minPerTask
    };

    tasks.push(task);

    //check if input is number
    if (isNaN(minPerTask)) {
      alert('entry ' + taskName[i].value + ' has invalid time input');
      tasks = [];
      return false;
    }
  }
  return true;
}

//starts timer and swithches to timer page
function startSession(e) {
  let inputValid = calculateTotalTime();

  if (inputValid) {
    //ring.play();
    //store tasks
    localStorage.setItem('tasks', JSON.stringify(tasks));
    window.location.href = './../pages/timer.html';
  }
  e.preventDefault();
}
