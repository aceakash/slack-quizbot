'use strict';
var sql = require('sqlite3').verbose();
var Promise = require('bluebird').Promise;

const db = new sql.Database('trivia.db');

module.exports = {
  getRandomQuestion,
  reportBadQuestion
};

function getRandomQuestion() {
  return new Promise(function (resolve, reject) {
    db.get('SELECT * FROM questions WHERE maybeBad = 0 ORDER BY RANDOM() LIMIT 1', function (err, doc) {
      if (err) {
        console.error('error retrieving random question', err);
        return reject(err);
      }
      resolve(doc);
    });
  });
}

function reportBadQuestion(report) {
  return new Promise(function (resolve, reject) {
    db.run('update questions set maybeBad=1 where id = ?', report.questionId, (err) => {
      if (err) {
        console.error('couldnt set maybeBad flag', err);
        return reject('couldnt set maybeBad flag');
      }
      db.run('insert into maybeBadNotes (questionId, note, reporter, dateTimeUtc) values (?, ?, ?, ?)',
        report.questionId, report.note, report.reporter, new Date().toISOString(), ()=>{
            resolve();
          }
      );
    });
  });
}
