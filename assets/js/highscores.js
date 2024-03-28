// The HighscoreList class represents a Top 10 of scores and provides functionality for
// adding scores and writing them to the highscore list displayed in index.html

export class HighscoreList {
  constructor(targetElement) {
    this.scores = [];
    this.targetElement = targetElement;
  }
  scoreToInt(score) {
    return parseInt(score.split(":").join(""));
  }
  scoreToString(score) {
    let scoreStr = "";

    // Some helper functions for converting parts of the score to the appropriate format
    function secToString(score) {
      let sec = 0;
      if (score >= 10000) {
        sec = score % 100;
      } else if (score >= 100) {
        sec = score % 100;
      } else {
        sec = score;
      }
      return sec / 10 < 1 ? "0" + sec.toString() : sec.toString();
    }
    function minToString(score) {
      let min = 0;
      if (score >= 10000) {
        min = Math.floor((score % 10000) / 100);
      } else {
        min = Math.floor(score / 100);
      }
      return min / 10 < 1 ? "0" + min.toString() : min.toString();
    }
    function hrsToString(score) {
      const hrs = Math.floor(score / 10000);
      return hrs / 10 < 1 ? "0" + hrs.toString() : hrs.toString();
    }
    // scoreStr is assigned by using the helper function above
    if (score / 100 < 1) {
      scoreStr = "00:00:" + secToString(score);
    } else if (score / 100 < 10) {
      scoreStr = "00:" + minToString(score) + ":" + secToString(score);
    } else {
      scoreStr =
        hrsToString(score) +
        ":" +
        minToString(score) +
        ":" +
        secToString(score);
    }
    return scoreStr;
  }
  // Checks if the new score is in the top 10 and calls addScore if yes
  checkScore(newScore) {
    const scoreInt = this.scoreToInt(newScore);
    if (this.scores.length === 0) {
      this.scores.push(scoreInt);
    } else if (this.scores.length < 10) {
      this.addScore(scoreInt);
    } else {
      for (const score of this.scores) {
        if (scoreInt >= score) {
          this.addScore(scoreInt);
          break;
        } else {
          continue;
        }
      }
    }
  }
  // Adds the score to the top 10, pushes the lowest score from the Top 10 if there are now
  // than 10 scores and sorts the Top 10 in descending order afterwards
  addScore(newScore) {
    if (this.scores.length < 10) {
      this.scores.push(newScore);
      this.scores.sort(this.compareNumbers);
    } else {
      this.scores.pop(-1);
      this.scores.push(newScore);
      this.scores.sort(this.compareNumbers);
    }
  }
  // Helper function for the sort method in addScore
  compareNumbers(a, b) {
    return b - a;
  }
  // Creates a new li element for every score in this.scores and adds the elements
  // to the highscores list displayed in index.html
  writeScores() {
    while (this.targetElement.firstChild) {
      this.targetElement.removeChild(this.targetElement.lastChild);
    }
    for (const score of this.scores) {
      const newScore = document.createElement("li");
      newScore.textContent = this.scoreToString(score);
      newScore.classList.add("highscore");
      this.targetElement.appendChild(newScore);
    }
  }
}
