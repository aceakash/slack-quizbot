// const loki = require('lokijs');
const _ = require('lodash');

// const db = new loki('quizballs.json');
const questions = require('./retro-questions.json')
let i = 0;

function getRandomQuestion() {
  return new Promise((fulfill, reject) => {
      
      const question = {
        q: questions[i].q,
        a: questions[i].a,
        id: questions[i]['$loki']
      }
      fulfill(question)
    });
}

module.exports = {getRandomQuestion};