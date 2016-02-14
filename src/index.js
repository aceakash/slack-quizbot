'use strict';

const quizBotFactory = require('./quiz-bot');
const questionHandler = require('./question-handler');
const scoreHandler = require('./score-handler');
const badQuestionReportHandler = require('./bad-question-report-handler');


const quizBot = quizBotFactory.makeQuizBot({
  handlers: [questionHandler, scoreHandler]
});

quizBot.start();
