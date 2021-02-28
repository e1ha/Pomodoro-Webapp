var questionButton = document.getElementById('questionButton');
questionButton.addEventListener('click', redirectToInstructionsPage);

function redirectToInstructionsPage() {
  window.location.href = '/cse110-wi21-group7/src/pages/instructions.html';
}
