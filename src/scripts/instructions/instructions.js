let currStep = 1;

/**
 * Runs the following code on window load
 */
window.onload = () => {
  var continueButton = document.getElementById('continueButton');
  continueButton.addEventListener('click', redirectToTasksPage);

  var stepImage = document.getElementById('stepImage');
  stepImage.src = `../images/step${currStep}.svg`;

  var leftButton = document.getElementById('stepLeft');
  var rightButton = document.getElementById('stepRight');

  rightButton.addEventListener('click', () => {
    if (currStep < 11) {
      currStep = currStep + 1;
      stepImage.src = `../images/step${currStep}.svg`;
    }
  });

  leftButton.addEventListener('click', () => {
    if (currStep > 1) {
      currStep = currStep - 1;
      stepImage.src = `../images/step${currStep}.svg`;
    }
  });
};

/**
 * Function redirects to the task page
 */
function redirectToTasksPage() {
  window.location.href = '../pages/tasks.html';
}

module.exports = redirectToTasksPage;
