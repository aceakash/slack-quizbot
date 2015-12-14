var Slack = require('slack-client');
var _ = require('lodash');
var util = require('util');

var config = require('./config');
var quizRepo = require('./quiz-repo');
var formatAsBlanks = require('./format-as-blanks');

var questionTimeoutSec = 30; // todo: parameterise

function Player (id, name) {
  this.id = id;
  this.name = name;
  this.points = 0;
}

function findPlayer (id, players) {
  return players.filter(function(p) {
    return p.id === id; 
  })[0]; 
}

function prune (text) {
  return text.toLowerCase().trim();
}

function isNotBot (name) {
  return name.indexOf('.bot') === -1;
}


quizRepo.getQuestionCount()
  .then(function (doc) {
    var questionCount = doc.questionCount;
    console.log("%d questions loaded", questionCount);

    var autoReconnect = true;
    var autoMark = true;
    var slack = new Slack(config.get('slack.token'), autoReconnect, autoMark);

    slack.on('open', function () {
      console.log('Connected to Slack');
    });

    var states = {
      idle: 'idle',
      waitingForAnswer: 'waitingForAnswer'
    };

    var state = states.idle;
    var currentQuizItem = null;
    var timeQuestionAsked = null;
    var questionTimeOutId = null;
    var players = [];

    slack.on('message', function (message) {
      var channel = slack.getChannelGroupOrDMByID(message.channel);
      if (channel.name !== config.get('slack.channel')) {
        return;
      }
      var user = slack.getUserByID(message.user);

      var playersNames = players.map(function(p){ return p.name });

      if (user && user.name) {
        if (playersNames.indexOf(user.name) === -1 && isNotBot(user.name)) {
          var player = new Player(user.id, user.name);
          players.push(player);
        }
      }

      var type = message.type;
      var text = message.text;

      if (type === 'message' && channel && text && user) {

        var player = findPlayer(user.id, players);

        if (state === states.waitingForAnswer) {
          if (prune(text) == prune(currentQuizItem.a)) {
            clearTimeout(questionTimeOutId);
            state = states.idle;
            var timeDelta = (new Date() - timeQuestionAsked) / 1000;
            player.points++;
            scoreboard = _.sortBy(scoreboard, 'points').reverse(); // sort hi-low
            channel.send(user.name + " answered correctly in " + timeDelta + " seconds");
          }
        } else if (prune(text) === 'scores') {
          var scoreboard = players.map(function(p){ return p.name.split('').join('_') + ": " + p.points; }).join("\n")
          channel.send(":trophy: *Current Scores* :trophy: \n" + scoreboard);
        } else if (prune(text) === 'q') {
          quizRepo.getQuestionById(_.random(questionCount), function (err, doc) {
            currentQuizItem = doc;
            channel.send(util.format('[%s] %s ( %s )', doc.id, doc.q, formatAsBlanks(doc.a)));
            timeQuestionAsked = new Date();
            questionTimeOutId = setTimeout(function () {
              state = states.idle;
              channel.send('Time up! The answer was: ' + currentQuizItem.a);
            }, questionTimeoutSec * 1000);
            state = states.waitingForAnswer;
            console.log("Sent question:", currentQuizItem);
          });
        }
      }
    });

    slack.on('error', function (error) {
      console.error('Error: ', error);
    });

    slack.login();

  });


