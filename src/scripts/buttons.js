let TASKS = [];
let placeholders = true;

// Unique random int generator (1-10000)
function uniqueInt() {
  let randInt = Math.floor(Math.random() * 10000) + 1;
  if (TASKS.filter((task) => task.id === randInt).length > 0) {
    return uniqueInt();
  } else {
    return randInt;
  }
}

/* Function to create a new li (task) element in html
 *
 * @param {int} id of the newly created task
 * @return {object} task object is returned
 */
function addTask(id) {
  let taskHTML = `<li id="task-${id}">
                    <input id="name-${id}" type="text" name="task" class="task animation-create-task" placeholder="Enter Task..."> 
                    <input id="min-${id}" type="text" name="time" class="taskTime animation-create-time" placeholder="min"> 
                    <button class="delete" id="${id}">X</button>
                  </li>`;
  document
    .getElementById('tasksList')
    .insertAdjacentHTML('beforeend', taskHTML);

  let task = {
    id: id,
    taskName: '',
    min: '',
    pomos: 0,
    done: false
  };

  // Updates information in TASKS whenever a change is made
  document
    .getElementById('name-' + task.id)
    .addEventListener('change', (event) => {
      TASKS = TASKS.map((e) =>
        e.id == event.target.id.substr(5)
          ? { ...e, taskName: event.target.value }
          : e
      );
    });
  document
    .getElementById('min-' + task.id)
    .addEventListener('change', (event) => {
      TASKS = TASKS.map((e) =>
        e.id == event.target.id.substr(4)
          ? {
              ...e,
              min: event.target.value,
              pomos: minToPomos(parseInt(event.target.value))
            }
          : e
      );
    });

  // Add click event for delete button
  document.getElementById(task.id).addEventListener('click', (event) => {
    event.preventDefault();

    deleteTask(event.target.id);
  });

  return task;
}

/* Function to delete a li (task) element in html based off id
 *
 * @param {int} id of the desired task element
 */
function deleteTask(id) {
  document
    .getElementById('tasksList')
    .removeChild(document.getElementById('task-' + id));

  TASKS = TASKS.filter((e) => {
    return e.id != id;
  });

  // If taskList is empty, add back placeholders
  if (document.getElementById('tasksList').innerHTML === '') {
    document.getElementById('addTaskBtn').className = 'animation-highlight';
    placeholders = true;
    document.getElementById('tasksList').innerHTML = `
      <li>
        <input type="text" name="task" class="pTask animation-create-task" placeholder="Study for exam..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animation-create-time" placeholder="60" disabled="true"> 
        <button class="delete" disabled="true">X</button>
      </li>
      <li>
        <input type="text" name="task" class="pTask animation-create-task" placeholder="Write down lecture notes..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animation-create-time" placeholder="45" disabled="true"> 
        <button class="delete" disabled="true">X</button>
      </li>
      <li>
        <input type="text" name="task" class="pTask animation-create-task" placeholder="Do math homework..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animation-create-time" placeholder="20" disabled="true"> 
        <button class="delete" disabled="true">X</button>
      </li>
      <li>
        <input type="text" name="task" class="pTask animation-create-task" placeholder="Start on group project..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animation-create-time" placeholder="30" disabled="true"> 
        <button class="delete" disabled="true">X</button>
      </li>`;
  }
}

// Add click event for addTaskBtn
document.getElementById('addTaskBtn').addEventListener('click', (event) => {
  event.preventDefault();

  // Remove placeholders when adding a task
  if (placeholders) {
    placeholders = false;
    document.getElementById('tasksList').innerHTML = '';
    document.getElementById('addTaskBtn').className = '';
  }

  // Limit 1000 tasks
  if (TASKS.length >= 1000) {
    confirm('You are unable to create any more tasks.');
  } else {
    // Create new empty task and push it to TASKS
    TASKS.push(addTask(uniqueInt()));
  }
});

/* Function to convert minutes into pomos
 *
 * @param {int} min is the amount of minutes being converted
 */
function minToPomos(min) {
  let pomos = Math.floor(min / 25);

  if (min % 25 > 0) {
    pomos = pomos + 1;
  }

  return pomos;
}

/******Start */
var startButton = document.getElementById('startButton');
// var addTaskBtn = document.getElementById('addTaskBtn');
startButton.addEventListener('click', startSession, false);
//addTaskBtn.addEventListener('click', updateTimes, false);

//var taskTime = [];
//var taskName = [];
//var tasks = [];

//updates the arrays for new input values
// function updateTimes() {
//   taskTime = document.getElementsByClassName('taskTime animation-create-time');
//   taskName = document.getElementsByClassName('task animation-create-task');
// }

//var ring = document.getElementById('ring');

//loops through task list and calculates total time
function calculateTotalTime() {
  if (TASKS.length < 1) {
    alert('no tasks');
    return false;
  }

  for (let i = 0; i < TASKS.length; ++i) {
    let minPerTask = TASKS[i].min;

    minPerTask = parseInt(minPerTask); //covert input to number

    //task object for storage
    // let task = {
    //   id: taskName[i].parentElement.id,
    //   name: taskName[i].value,
    //   time: minPerTask
    // };

    // tasks.push(task);

    //check if input is number
    if (isNaN(minPerTask)) {
      alert('entry ' + TASKS[i].taskName + ' has invalid time input');
      //   tasks = [];
      return false;
    } else if (minPerTask > 180) {
      alert('entry ' + TASKS[i].taskName + ' exceeds maximum limit');
      //   tasks = [];
      return false;
    } else if (minPerTask < 1) {
      alert('entry ' + TASKS[i].taskName + ' under minimum limit');
      //   tasks = [];
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
    localStorage.setItem('tasks', JSON.stringify(TASKS));
    window.location.href = './../pages/timer.html';
  }
  e.preventDefault();
}

/*****Question */
var questionButton = document.getElementById('questionButton');
questionButton.addEventListener('click', redirectToInstructionsPage);

function redirectToInstructionsPage() {
  window.location.href = '../pages/instructions.html';
}

/******Continue */
// var continueButton = document.getElementById('continueButton');
// continueButton.addEventListener('click', redirectToTasksPage);

// function redirectToTasksPage() {
//   window.location.href = '/cse110-wi21-group7/src/pages/tasks.html';
// }
