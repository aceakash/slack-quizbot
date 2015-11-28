A quizbot for Slack
-------------------

Connects to Slack, listens for the keyword 'q' in a particular channel, then spits out a question.

If no one gives the right answer within 30 seconds, divulges it and waits for the keyword again.


### Run the app

```
npm install

SLACK_TOKEN=your_bot_slack_token SLACK_CHANNEL=a_slack_channel npm start

```

### Environment variables

#### SLACK_TOKEN

In your Slack configuration, under "Configure Integrations" > "Bots" > Add Bot Integration, create a bot and grab the Slack token associated with it.

#### SLACK_CHANNEL

The quizbot will only listen to the keyword 'q' in the channel specified by this.
