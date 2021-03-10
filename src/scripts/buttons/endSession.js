/********************************************
  The end button:
    Once clicked, go straight to the tasks page
 *********************************************/
window.onload = () => {
  var endButton = document.getElementById('EndSessionButton');
  endButton.addEventListener('click', endSession);
};

/*
    The session is ended and we return to the tasks page
  */
function endSession() {
  alert('You have ended the session. Returning to the task page...');
  window.location.href = '../pages/tasks.html';
}
module.exports = endSession;
