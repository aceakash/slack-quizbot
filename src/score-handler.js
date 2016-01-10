'use strict';

const _ = require('lodash');

const questionHandler = require('./question-handler');
const scoreRepo = require('./score-repo');
const players = [];

function start(slackChannel) {
  scoreRepo.init().then(() => {
    slackChannel.on('msg', (msgDetails) => {
      if (msgDetails.prunedText !== 'scores') {
        return;
      }
      const scores = getFormattedScores().then((scores) => {
        slackChannel.send(scores);
      });
    });

    questionHandler.on('correctAnswer', details => {
      details.ts = new Date().toISOString();
      scoreRepo.writeScore(details)
        .catch((err) => {
            console.error('Could not update score', err);
        })
    });
  });
}

function getFormattedScores() {
  return new Promise((resolve, reject) => {
    const scores = scoreRepo.getScores().then((scores) => {
      scores = Array.prototype.concat([], scores);
      let result = ":trophy: *Current Scores* :trophy: \n";
      result += scores
        .map(score => `${getFormattedName(score.userName)} : ${score.score} (avg: ${score.averageAnswerTimeSec.toFixed(2)} s)`)
        .join('\n');
      return resolve(result);
    });
  });
}

function getFormattedName(name) {
  const letters = name.split('');
  return letters[0] + '-' + letters.splice(1).join('');
}

module.exports = {
  start
};
