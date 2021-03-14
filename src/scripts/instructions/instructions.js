window.onload = () => {
  var continueButton = document.getElementById('continueButton');
  continueButton.addEventListener('click', redirectToTasksPage);
};

function redirectToTasksPage() {
  window.location.href = '../pages/tasks.html';
}

module.exports = redirectToTasksPage;