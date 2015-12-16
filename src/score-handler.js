'use strict';

const questionHandler = require('./question-handler');

const players = [];

function start(slackChannel) {
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
  });
}

function getFormattedScores() {
  const players = getPlayersSortedByScore();
  let result = "Scores:\n";
  result += players
    .map(player => `${player.userName} : ${player.score}`)
    .join('\n');
  return result;
}

function getPlayersSortedByScore() {
  return players;
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
