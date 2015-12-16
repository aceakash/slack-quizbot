'use strict';

module.exports = {
  makeQuizBot
};

function makeQuizBot(options) {
  const slackChannel = options.slackChannel ||
    require('./slack-channel').makeSlackChannel();
  const handlers = options.handlers || [];

  return {
    start() {
      handlers.forEach(handler => {
        handler.start(slackChannel);
      });
    }
  };
}


