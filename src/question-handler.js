'use strict';

function start(slackChannel) {
  slackChannel.on('msg', (msgDetails) => {
    slackChannel.send('msg received by questionHandler: ' + msgDetails.text);
  });
}

module.exports = {
  start
};
