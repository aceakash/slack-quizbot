'use strict';

const config = require('./config');
const Slack = require('slack-client');
const EventEmitter = require('events').EventEmitter;


function makeSlackChannel() {
  const slackChannel = {
    send: sendMessage
  };
  makeEventEmitter(slackChannel);
  const slack = setupSlack();
  let rawSlackChannel;
  setupMessageListener(slackChannel, slack);
  return slackChannel;


  function sendMessage(messageText) {
    rawSlackChannel.send(messageText);
  }

  function setupMessageListener(slackChannel, slack) {
    slack.on('message', (messageDetails) => {
      const channel = slack.getChannelGroupOrDMByID(messageDetails.channel);
      const user = slack.getUserByID(messageDetails.user);

      if (isMessageRelevant(channel, user, messageDetails.type)) {
        rawSlackChannel = channel;
        slackChannel.emit('msg', {
          text: messageDetails.text,
          userName: user.name,
          time: new Date()
        });
      }
    });
  }
}


function makeEventEmitter(obj) {
  obj.__proto__ = Object.create(EventEmitter.prototype);
}

function setupSlack() {
  const slack = new Slack(config.get('slack.token'), true, true);
  slack.on('open', function () {
    console.log('Connected to Slack');
  });
  slack.on('error', function (error) {
    console.error('Error: ', error);
  });
  slack.login();
  return slack;
}

function isMessageRelevant(rawChannel, user, messageType) {
  const isTriviaChannel = rawChannel.name === config.get('slack.channel');
  const isFromRegularUser = user && user.name;
  const isTypeMessage = messageType === 'message';

  let isMessageRelevant = true;
  if (!isTriviaChannel || !isFromRegularUser || !isTypeMessage) {
    isMessageRelevant = false;
  }
  return isMessageRelevant;
}


module.exports = {
  makeSlackChannel
};

