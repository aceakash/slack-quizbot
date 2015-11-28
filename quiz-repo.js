var sql = require('sqlite3').verbose();
var Promise = require('bluebird').Promise;

var db = new sql.Database('trivia.db');

function getQuestionCount() {
  return new Promise(function (resolve, reject) {
    db.get('select count(1) as questionCount from questions', function (err, doc) {
      if (err) {
        console.error('error retrieving question count', err);
        return reject(err);
      }
      resolve(doc);
    });
  });
}

function getQuestionById(id, callback) {
  db.get('select * from questions where id = ?', id, function (err, doc) {
    if (err) {
      console.error('Error while gettting question by id', id, err);
      return callback(err);
    }
    return callback(null, doc);
  });
}

exports.getQuestionById = getQuestionById;
exports.getQuestionCount = getQuestionCount;
