'use strict';

const util = require('util');
const quizRepo = require('./quiz-repo');

const questionTimeoutSec = 10; // todo: parameterise

const states = {
  idle: 'idle',
  waitingForAnswer: 'waitingForAnswer'
};
let current = {
  state: states.idle,
  timeQuestionAsked: null,
  questionTimeOutId: null,
  quizItem: null
};

function start(slackChannel) {
  slackChannel.on('msg', msgDetails => {
    if (current.state === states.idle) {
      if (msgDetails.prunedText !== 'q') {
        return;
      }
      current.state = states.waitingForAnswer;
      quizRepo.getRandomQuestion()
        .then(doc => {
          current.quizItem = doc;
          console.log(doc);
          current.timeQuestionAsked = new Date();
          current.questionTimeOutId = setTimeout(function () {
            current.state = states.idle;
            slackChannel.send('Time up! The answer was: ' + current.quizItem.a);
          }, questionTimeoutSec * 1000);
          slackChannel.send(util.format('[%s] %s ( %s )',
            doc.id, doc.q, formatAsBlanks(doc.a)));
        });
    }
    else if (current.state === states.waitingForAnswer) {
      if (msgDetails.prunedText == prune(current.quizItem.a)) {
        clearTimeout(current.questionTimeOutId);
        current.state = states.idle;
        var timeDelta = (new Date() - current.timeQuestionAsked) / 1000;
        slackChannel.send(msgDetails.userName + " answered correctly in " + timeDelta + " seconds");
      }
    }
  });
}

function formatAsBlanks(string) {
  return string.replace(/\w/g, 'x');
}

function prune (text) {
  return text.toLowerCase().trim();
}


module.exports = {
  start
};
