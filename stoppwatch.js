export class StoppWatch {
  constructor(targetElement, hrs, min, sec) {
    this.targetElement = targetElement;
    this.hrs = hrs;
    this.min = min;
    this.sec = sec;
    this.intervalID;
  }
  start() {
    this.intervalID = setInterval(this.addSec.bind(this), 1000);
  }
  addSec() {
    this.sec++;
    if (this.sec === 60) {
      this.min++;
      this.sec = 0;
      if (this.min === 60) {
        this.hrs++;
        this.min = 0;
      }
    }
    this.targetElement.textContent = `${
      this.hrs < 10 ? "0" + this.hrs : this.hrs
    }:${this.min < 10 ? "0" + this.min : this.min}:${
      this.sec < 10 ? "0" + this.sec : this.sec
    }`;
  }
  getIntervalID() {
    return this.intervalID;
  }
  setTime(hrs, min, sec) {
    this.hrs = hrs;
    this.min = min;
    this.sec = sec;
  }
  getTime() {
    return [this.hrs, this.min, this.sec];
  }
}
