const sql = require('sqlite3').verbose();
const db = new sql.Database('scores.db');

module.exports = {
    init,
    writeScore,
    getScores
};

function init() {
  return createScoresTableIfNotPresent();
}

function getScores() {
  return new Promise((resolve, reject) => {
      const query = 'select userName, count(1) as score, avg(answerTimeSec) as averageAnswerTimeSec from scores group by username order by score desc';
      db.all(query, (err, docs) => {
          if (err) {
            return reject(err);
          }
          return resolve(docs);
      });
  });
}

function createScoresTableIfNotPresent() {
  return new Promise(function (resolve, reject) {
    const createQuery = 'CREATE TABLE IF NOT EXISTS scores (dateTimeUtc TEXT not null, userName TEXT not null, questionId INTEGER not null, answerTimeSec REAL not null)';
    db.run(createQuery, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
    });
  });
}

function writeScore(details) {
  return new Promise((resolve, reject) => {
    db.run('insert into scores (dateTimeUtc, userName, questionId, answerTimeSec) values (?, ?, ?, ?)',
      details.ts, details.userName, details.questionId, details.answerTime, (err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
    );
  });
}
