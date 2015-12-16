'use strict';

const util = require('util');
const quizRepo = require('./quiz-repo');

const questionTimeoutSec = 10; // todo: parameterise

const states = {
  idle: 'idle',
  waitingForAnswer: 'waitingForAnswer'
};
let currentSituation = {
  state: states.idle,
  timeQuestionAsked: null,
  questionTimeOutId: null,
  quizItem: null
};

function start(slackChannel) {
  slackChannel.on('msg', msgDetails => {
    if (currentSituation.state === states.idle) {
      if (msgDetails.prunedText !== 'q') {
        return;
      }
      currentSituation.state = states.waitingForAnswer;
      quizRepo.getRandomQuestion()
        .then(doc => {
          currentSituation.quizItem = doc;
          currentSituation.timeQuestionAsked = new Date();
          currentSituation.questionTimeOutId = setTimeout(function () {
            currentSituation.state = states.idle;
            slackChannel.send('Time up! The answer was: ' + currentSituation.quizItem.a);
          }, questionTimeoutSec * 1000);
          slackChannel.send(util.format('[%s] %s ( %s )',
            doc.id, doc.q, formatAsBlanks(doc.a)));
        });
    }
    else if (currentSituation.state === states.waitingForAnswer) {

    }
  });
}

function formatAsBlanks(string) {
  return string.replace(/\w/g, 'x');
}

module.exports = {
  start
};
