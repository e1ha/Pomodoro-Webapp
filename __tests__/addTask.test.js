const { addTask } = require('../src/scripts/buttons.js');

test('Check if addTask adds to TASK list', () => {
  document.body.innerHTML = `
    <ul class="tasksList" id="tasksList"></ul>
  `;

  let taskHTML = `<li id="task-1">
                    <input id="name-1" type="text" name="task" class="task animation-create-task" placeholder="Enter Task..."> 
                    <input id="min-1" type="text" name="time" class="taskTime animation-create-time" placeholder="min"> 
                    <button class="delete" id="1">X</button>
                  </li>`;
  addTask(1);

  const tasksList = document.getElementById('tasksList');
  expect(tasksList.innerHTML).toMatch(taskHTML);
});
