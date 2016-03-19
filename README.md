A quizbot for Slack
-------------------

Connects to Slack, listens for the keyword 'q' in a particular channel, then spits out a question.

If no one gives the right answer within 30 seconds, divulges it and waits for the keyword again.

The command 'scores' at any time will show scores per user and their average answer time. Usernames in the scores table shown have a '-' in them to avoid notifying the user that their name was mentioned.

### Run the app

```
npm install

SLACK_TOKEN=xoxb-your-slack-token SLACK_CHANNEL=some-slack-channel-name npm start

```

### Environment variables

#### SLACK_TOKEN

In your Slack configuration, under "Configure Integrations" > "Bots" > Add Bot Integration, create a bot and grab the Slack token associated with it.

Example value: xoxb-15106453377-AfhxDe4a4iEar7ZDHAhZSWER

#### SLACK_CHANNEL

The quizbot will only be active in this channel.

Example value: quiztime

#### QUESTION_TIMEOUT_SEC (optional, default 30)

... is how long the quiz bot will wait for the right answer before divulging it. Specified in seconds.

Example value: 15

### Run the app in Docker

```
docker build -t slack-quizbot .
docker run --rm -it -v `pwd`/data:/src/data  -e "SLACK_TOKEN=xoxb-your-slack-token" -e "SLACK_CHANNEL=some-slack-channel-name" slack-quizbot
```
