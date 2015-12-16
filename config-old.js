var convict = require('convict');

var conf = convict({
  slack: {
    token: {
      doc: "Slack token for the bot.",
      format: emptyStringCheck,
      default: '',
      env: "SLACK_TOKEN"
    },
    channel: {
      doc: "Slack channel that the bot operates in.",
      format: emptyStringCheck,
      default: '',
      env: "SLACK_CHANNEL"
    }
  }
});

conf.validate({strict: true});

module.exports = conf;


function emptyStringCheck(val) {
  if (typeof val !== 'string') {
    throw new Error('must be a string');
  }
  if (val.length === 0) {
    throw new Error('must not be an empty string');
  }
}
