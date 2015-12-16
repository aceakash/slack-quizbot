'use strict';

function start(slackChannel) {
  slackChannel.on('msg', (msgDetails) => {
    if (msgDetails.prunedText !== 'scores') {
      return;
    }
    slackChannel.send('msg received by scoreHandler: ' + msgDetails.text);
  });
}

module.exports = {
  start
};
