let TASKS = [];
let placeholders = true;

/**
 * Runs the following code on window load
 */
window.onload = () => {
  // Clear local storage if the user has just completed an entire session
  if (localStorage.getItem('done')) {
    localStorage.clear();
  }

  // If there are tasks in local storage add them to the task list
  let storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks && storedTasks.length > 0) {
    placeholders = false;
    document.getElementById('tasksList').innerHTML = '';
    document.getElementById('addTaskBtn').className = '';
    storedTasks.forEach((task) => {
      TASKS.push(task);
      addTask(task.id);
      document.getElementById(`name-${task.id}`).value = task.taskName;
      document.getElementById(`min-${task.id}`).value = task.min;
    });
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
      alert('You are unable to create any more tasks.');
    } else {
      // Create new empty task and push it to TASKS
      TASKS.push(addTask(uniqueInt()));
    }
  });

  // Add click event for start button
  var startButton = document.getElementById('startButton');
  startButton.addEventListener(
    'click',
    (event) => {
      event.preventDefault();
      let inputValid = calculateTotalTime(TASKS);

      if (inputValid) {
        startSession();
      }
    },
    false
  );

  // Add click event for question button
  var questionButton = document.getElementById('questionButton');
  questionButton.addEventListener('click', redirectToInstructionsPage);
};

/**
 * Generates a random unique int
 *
 * @returns { int } from 1 to 10000
 */
function uniqueInt() {
  let randInt = Math.floor(Math.random() * 10000) + 1;

  if (TASKS.filter((task) => task.id === randInt).length > 0) {
    return uniqueInt();
  } else {
    return randInt;
  }
}

/**
 * Function to create a new li (task) element in html
 *
 * @param {int} id of the newly created task
 * @return {object} task object is returned
 */
function addTask(id) {
  let taskHTML = `<li id="task-${id}">
                    <input id="name-${id}" type="text" name="task" class="task animationCreateTask" placeholder="Enter Task..."> 
                    <input id="min-${id}" type="text" name="time" class="taskTime animationCreateTime" placeholder="min"> 
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

  // Adds an event listener to tasks whenever a change is made and updates TASKS
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

  // Add a click event for the delete button of the newly created task
  document.getElementById(task.id).addEventListener('click', (event) => {
    event.preventDefault();

    deleteTask(event.target.id);
  });

  return task;
}

/**
 * Function to delete a li (task) element in html based off id
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
    document.getElementById('addTaskBtn').className = 'animationHighlight';
    placeholders = true;
    document.getElementById('tasksList').innerHTML = `
      <li>
        <input type="text" name="task" class="pTask animationCreateTask" placeholder="Press Add Task..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animationCreateTime" placeholder="60" disabled="true"> 
      </li>
      <li>
        <input type="text" name="task" class="pTask animationCreateTask" placeholder="Press Add Task..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animationCreateTime" placeholder="45" disabled="true"> 
      </li>
      <li>
        <input type="text" name="task" class="pTask animationCreateTask" placeholder="Press Add Task..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animationCreateTime" placeholder="20" disabled="true"> 
      </li>
      <li>
        <input type="text" name="task" class="pTask animationCreateTask" placeholder="Press Add Task..." disabled="true"> 
        <input type="text" name="time" class="pTaskTime animationCreateTime" placeholder="30" disabled="true"> 
      </li>`;
  }
}

/**
 * Function to convert minutes into pomos
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

/**
 * Function loops through all the inputted tasks
 * and calculates the total time while valid checking
 *
 * @param {*} Arr is the list of tasks
 * @returns {Boolean} True
 */
function calculateTotalTime(Arr) {
  if (Arr.length < 1) {
    alert('Please add a task to start!');
    return false;
  }

  for (let i = 0; i < Arr.length; ++i) {
    let minutes = Arr[i].min;

    // Converts input to number
    let minPerTask = parseFloat(minutes);

    // Checks if the min inputs are valid
    if (isNaN(minutes) || isNaN(minPerTask)) {
      alert('Entry: [' + i + '] has an invalid time input');
      return false;
    } else if (minPerTask > 180) {
      alert(
        'Entry: [' +
          i +
          '] exceeds maximum limit. Please consider splitting this task up!'
      );
      return false;
    } else if (minPerTask < 1) {
      alert('Entry: [' + i + '] is under the minimum limit');
      return false;
    }
  }

  return true;
}

/**
 * Function stores task in local storage and redirects to timer page
 */
function startSession() {
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  window.location.href = './../pages/timer.html';
}

/**
 * Function stores task in local storage and redirects to instructions page
 */
function redirectToInstructionsPage() {
  localStorage.setItem('tasks', JSON.stringify(TASKS));
  window.location.href = '../pages/instructions.html';
}

module.exports = {
  addTask,
  redirectToInstructionsPage,
  deleteTask,
  startSession,
  calculateTotalTime
};
