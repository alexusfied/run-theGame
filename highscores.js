export class Highscores {
  constructor(targetList) {
    this.targetList = targetList;
    this.scores = [[0, 0, 0]];
  }
  checkScore(newScore) {
    for (let i = 0; i < this.scores.length; i++) {
      if (newScore[0] > this.scores[i][0]) {
        this.scores[i] = newScore;
        break;
      } else if (newScore[1] > this.scores[i][1]) {
        this.scores[i] = newScore;
        break;
      } else if (newScore[2] > this.scores[i][2]) {
        this.scores[i] = newScore;
        break;
      } else {
        continue;
      }
    }
  }
  writeList() {
    this.scores.forEach((score) => {
      let listElement = document.createElement("li");
      listElement.textContent = `${score[0]}:${score[1]}:${score[2]}`;
      this.targetList.appendChild(listElement);
    });
  }
}
