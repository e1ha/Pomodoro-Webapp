/*eslint disable*/
class Timer {
  constructor(duration, elementID) {
    this.running = false;
    this.duration = duration;
    this.elementID = elementID;
    this.start;
    this.timerID;
  }

  stopTimer() {
    this.running = false;
    clearInterval(this.timerID);
  }

  countDown() {
    // currently I used a p tag for html text
    let element = document.getElementById(this.elementID);
    let difference = this.duration - (((Date.now() - this.start) / 1000) | 0);
    if (difference < 0) {
      this.stopTimer();
      return;
    }
    // Math Magic :)
    //let hours = (difference / 3600) | 0;
    //difference = difference % 3600 | 0;
    let minutes = (difference / 60) | 0;
    let seconds = difference % 60 | 0;
    // these lines format the number to have a minimum of 2 digits
    /*
      hours = hours.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
      });
      */
    minutes = minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2
    });
    seconds = seconds.toLocaleString('en-US', {
      minimumIntegerDigits: 2
    });
    // the text in html is a p tag so this line may be different depends
    //on the html element it modifies
    element.innerHTML = minutes + ':' + seconds;
  }

  startTimer() {
    this.running = true;
    this.start = Date.now();
    this.countDown();
    var self = this;
    this.timerID = setInterval(function () {
      self.countDown();
    }, 500);
  }
}

