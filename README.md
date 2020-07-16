# edusoftbot

## Overview

This is a template for a discord bot to crawl and notify student about their scores of the International University.

## Dependencies

- [puppeteer](https://pptr.dev)
- [dotenv](https://github.com/motdotla/dotenv#readme)
- [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

## Usage

### Configuration

The dependenencies can be set up via the command `npm install`. If NodeJS and Node Package Manager is not available in the local device, please install it from [here](https://nodejs.org).

Once the installation is completed, create a new file named `.env` and copy the following line to it:

```.env
USERNAME="your username"
PASSWORD="your password"
TOKEN="your chatbot token"
ANNOUCEMENT_CHANNEL="your announcement channel id"
```

Chat bot token can be retrieved once you have created the discord bot, and announcement channel id can be obtained via the discord api. Please refer to discord documentation via this [link](https://discord.js.org/#/docs/main/stable/general/welcome).

### Execution

Once NodeJS is installed and the configuration is finished, run `node my_bot` in Terminal (for OS X/Linux), or command prompt (Window). If the internet connection is stable, it will take about at least 15 seconds for the bot to be fully executed, signified by the creation of `score.json` (the loaded score) and `logging.log`. In addition, if Discord notification is turned on, then there should be a notification on the channel to which the bot is required to inform. The notification will be in the following form.

```.txt
Score initialized:
...
- <Subject name>
    - Attendance Score: <Inclass score> (<Percentage it occupies>)
    - Midterm score: <midterm score> (<Percentage it occupies>)
    - Final score: <final score> (<Percentage it occupies>)
    - Overall score: <overall score>
...
```

By default, the bot will scrape the score of the user every 15 minutes. This duration can be adjusted by changing the value of `loadPeriod` in `my_bot.js`. Please be notice that all duration must be converted to milliseconds.

### Features

The bot will notify the student if at least one of the following event takes place:

- _Score updated_: When a subject has at least one score attribute adjustment (midterm score added/final score adjusted/etc), this notification will be triggered. It is signified by the phrase `Score updated` at the beginning of the notification.

```.txt
Score updated:
- <Subject name>
    - Attendance Score: <Inclass score> (<Percentage it occupies>)
    - Midterm score: <midterm score> (<Percentage it occupies>)
    - Final score: <final score> (<Percentage it occupies>)
    - Overall score: <overall score>
...
```

- _Score added_: When a subject is added to the subject list, the name of the subject will be notified to the student. It is symbolized by the phrase `Score added` at the beginning of the notification.

```.txt
Score added:
- <Subject name 1>
- <Subject name 2>
- ...
```
