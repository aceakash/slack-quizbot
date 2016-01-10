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
      const scores = getFormattedScores();
      slackChannel.send(scores);
    });

    questionHandler.on('correctAnswer', details => {
      console.log('received event correctAnswer', details);
      updatePlayer(players, details.userName, details.answerTime);
      console.log(players);
      details.ts = new Date().toISOString();
      scoreRepo.writeScore(details)
        .catch((err) => {
            console.error('Could not update score', err);
        })
    });
  });
}

function getFormattedScores() {
  const players = getPlayersSortedByScore();
  let result = ":trophy: *Current Scores* :trophy: \n";
  result += players
    .map(player => `${getFormattedName(player.userName)} : ${player.score} (avg: ${getAverageAnswerTimeForPlayer(player)} s)`)
    .join('\n');
  return result;
}

function getAverageAnswerTimeForPlayer(player) {
  const totalTime = player.answerTimes.reduce((prev, curr) => prev + curr);
  return (totalTime/player.answerTimes.length).toFixed(2);
}

function getPlayersSortedByScore() {
  return _.sortBy(players, 'score').reverse();
}

function getFormattedName(name) {
  const letters = name.split('');
  return letters[0] + '-' + letters.splice(1).join('');
}

function updatePlayer(players, userName, answerTime) {
  var player = players.filter(p => p.userName === userName)[0];
  if (!player) {
    player = {
      userName: userName,
      score: 0,
      answerTimes: []
    };
    players.push(player);
  }
  player.score += 1;
  player.answerTimes.push(answerTime);
}

module.exports = {
  start
};
