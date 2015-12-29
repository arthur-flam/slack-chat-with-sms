# Slack-chat-with-SMS

You love [Slack](https://slack.com/)?
Now anyone can send you text messages / SMS.
The conversation starts in its own Slack channel, and you can reply `/sms anything you like`.

![Preview](https://raw.github.com/arthur-flam/slack-chat-with-sms/master/screen-capture.png)

## Setup and configuration

```bash
git clone git@github.com:arthur-flam/slack-chat-with-sms.git
cp config.js.sample config.js
npm install
```

Before you type `npm start`, you will need to setup the [Slack] integration and SMS integration...
Sorry it is a bit long, but consider how amazing it is to chat with anyone via SMS through Slack.

First of all type your hostname/ip/protocole in the new `config.js` file.

### Setting up Nexmo (inexpensive and friendly SMS provider)
1. Get a [Nexmo account](https://nexmo.com)
2. Get a sms-enabled phone number and type it in the *config.js* file.
3. Copy-paste the `APP_ID` or `KEY` and `APP_SECRET` available on the *API settings* on the config file.
5. Configure the SMS settings for you number. The Callback URL should be *http://YOUR_HOSTNAME/v1/sms/in*

### Slack integration
1. Type your team name (like *NAME.slack.com*) in the config file.
1. [Setup a slash command](https://lookies.slack.com/apps/manage/custom-integrations) as a custom integration. This will let you reply with `/sms` :
     * As URL use `http://YOUR_HOSTNAME/v1/hook`
     * As command name use `/sms` or `reply`. `/s` is already the search command!
	 * Check method is **POST**
	 * You can copy-paste the command token in the *config.js* file
	 * Use any custom, name, icon, label, description...
2. [Create an API token](https://api.slack.com/web). This will enable our app to act on your behalf and create / post on channels.
     * Set it for you team
     * It should look like this `xoxp-ffff-ffffff-ffffff-fffffff`

## Starting the app
```bash
npm start
```
You should be live.

## TODO
- Write tests.
- Think use 1-click Slack integration button to get the tokens faster.
- Remember if channels exists with Slack's `channels.list` method instead if trying to create them each time.
- Features : mute, ask for Nexmo balance...

## Contributors & Contributing
- [Arthur Flam](https://twitter.com/ArthurFlam). Slack fan, into data science. Based in TLV.

I will be more than happy to receive pull requests and hear about bugs/issues :)
