'use strict';
var sql = require('sqlite3').verbose();
var Promise = require('bluebird').Promise;

const db = new sql.Database('trivia.db');

module.exports = {
  getRandomQuestion: getRandomQuestion
};

function getRandomQuestion() {
  return new Promise(function (resolve, reject) {
    db.get('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1', function (err, doc) {
      if (err) {
        console.error('error retrieving random question', err);
        return reject(err);
      }
      resolve(doc);
    });
  });
}
