const loki = require('lokijs');
const _ = require('lodash');

const db = new loki('quizballs.json');

function getRandomQuestion() {
  return new Promise((fulfill, reject) => {
    db.loadDatabase({}, () => {
      const coll = db.getCollection('quizItems');
      const doc = coll.get(_.sample(coll.idIndex));
      const question = {
        q: doc.q,
        a: doc.a,
        id: doc.$loki
      };
      fulfill(question);
    });
  });
}

module.exports = {getRandomQuestion};