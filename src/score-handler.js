'use strict';

function start(slackChannel) {
  slackChannel.on('msg', (msgDetails) => {
    slackChannel.send('msg received by scoreHandler: ' + msgDetails.text);
  });
}

module.exports = {
  start
};
