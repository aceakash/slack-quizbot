var Slack = require('slack-client');
var _ = require('lodash');
var util = require('util');

var config = require('./config');
var quizRepo = require('./quiz-repo');
var formatAsBlanks = require('./format-as-blanks');

var questionTimeoutSec = 30; // todo: parameterise


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


    slack.on('message', function (message) {
      var channel = slack.getChannelGroupOrDMByID(message.channel);
      if (channel.name !== config.get('slack.channel')) {
        return;
      }
      var user = slack.getUserByID(message.user);
      var type = message.type;
      var text = message.text;

      if (type === 'message' && channel && text) {
        if (state === states.waitingForAnswer) {
          if (text.toLowerCase().trim() == currentQuizItem.a.toLowerCase().trim()) {
            clearTimeout(questionTimeOutId);
            state = states.idle;
            var timeDelta = (new Date() - timeQuestionAsked) / 1000;
            channel.send(user.name + " answered correctly in " + timeDelta + " seconds");
          }
        }
        else if (text.toLowerCase().trim() === 'q') {
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


