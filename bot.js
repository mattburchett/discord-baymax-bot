// Require Discord Libraries
var Discordie = require('discordie');

// Require log4js for logging to files
var log4js = require('log4js');

// require moment-timezone for timezone conversion
var Moment = require('moment-timezone');

// require custom settings
var config = require('./config.json');

// Configure log4js
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/console.log', category: 'console'},
    { type: 'file', filename: 'logs/activeusers.log', category: 'activeusers'},
    { type: 'file', filename: 'logs/channels.log', category: 'channels'}
  ]
});

// set constant log4js variables
const logcon = log4js.getLogger('console');
const actcon = log4js.getLogger('activeusers');
const chancon = log4js.getLogger('channels');

// begin discord bot
const Events = Discordie.Events;
const client = new Discordie();

// issue connect to discord using the bot_token in config.json
client.connect({
  token: config.bot_token
});

// once connected
client.Dispatcher.on(Events.GATEWAY_READY, e => {
  // acknoledge connection to console logs
  logcon.info('Connected as: ' + client.User.username);
});

// check for the number of active users every 30 seconds and log to the active users logs
setInterval(function() {
  client.Users.fetchMembers(config.guild_id);
  actcon.info(config.guild_name + " Active Users: " + client.Users.onlineMembersForGuild(config.guild_id).length);}, 30000);

  // when messages are created
  client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    // log the guild name, the channel name, the username, and the message to the channels log and disable DMs.
    if (!e.message.isPrivate)
    chancon.info(e.message.guild.name + ":" + " #" + e.message.channel.name + ": " + "<" + e.message.displayUsername + ">: "+ e.message.content);

    if (e.message.channel.name == "mod" || e.message.channel.name == "helpers" ) {
      // begin chat commands

      // !ping
      if (e.message.content == "!ping")
      e.message.channel.sendMessage("pong");

      // !bacon
      if (e.message.content == "!bacon")
      e.message.channel.sendMessage("*gives " + e.message.author.nickMention + " a strip of delicious bacon.* ")

      // !cookie
      // if (e.message.content.indexOf("!cookie") >=0) {
      if (e.message.content == "!cookie") {
      e.message.channel.sendMessage("*gives " + e.message.author.nickMention + " a freshly made Oatmeal Raisin cookie.*")
      //   if (e.message.content !== "!cookie") {
      //     var input = e.message.content
      //     var fields = input.split(' ', 2)
      //     var user = client.Users.find(u => u.username == fields[1]);
      //     e.message.channel.sendMessage("*gives " + user.mention[fields[1] + " a freshly made Oatmeal Raisin cookie.*")
      // } else {
      //     e.message.channel.sendMessage("*gives " + e.message.author.nickMention + " a freshly made Oatmeal Raisin cookie.*")
      //   }
      }


      // !help
      if (e.message.content == "!help")
      e.message.channel.sendMessage("Sorry.");

      // end chat commands
      // begin Baymax easter eggs

      // ow
      if (e.message.content == "ow" || e.message.content == "Ow" || e.message.content == "OW" || e.message.content == "oW" || e.message.content == "Ow!" || e.message.content == "Ow.")
      e.message.channel.sendMessage("Hello. I am Baymax, your personal Discord companion. \r\r\
      https://cdn.discordapp.com/attachments/265064665099403264/294326730703896577/giphy-2.gif");

      // heart attack
      if (e.message.content.indexOf('heart attack') >=0)
      e.message.channel.sendMessage("My hands are equipped with defibrillators. **CLEAR!** \r\r\
      https://cdn.discordapp.com/attachments/265064665099403264/294302721429995520/tumblr_n9h0l4ODbC1ry7whco1_1280.gif");

      // Cry emoji... There's actually a emoji there, I swear.
      if (e.message.content == "😢")
      e.message.channel.sendMessage("There, there. \r\r\
      https://cdn.discordapp.com/attachments/265064665099403264/294303907704864770/giphy-4.gif");

      // fist bump
      if (e.message.content == "*fist bump*" || e.message.content == "*fistbump*")
      e.message.channel.sendMessage("Ba-la-la-la-la! \r\r\
      https://cdn.discordapp.com/attachments/265064665099403264/294327036388835328/giphy-3.gif");

      // !lollipop
      if (e.message.content == "I'm satisfied with my care.")
      e.message.channel.sendMessage("You have been good, have a lollipop! \r\r\
      https://cdn.discordapp.com/attachments/265064665099403264/294333704749449216/Baemax-baymax-lollipop.gif");

      // end Baymax easter eggs
      // begin misc chat triggers

      // shrug
      if (e.message.content == "¯\\_(ツ)_/¯")
      e.message.channel.sendMessage("*mic drop*");

      // end misc chat triggers

      // begin mod-only command
      if (e.message.channel.name == "mod" || e.message.channel.name == "helpers" ) {

        // !birthday

        if (e.message.content == "!birthday")
        e.message.channel.sendMessage("List of Moderator Birthdays:\r\r\
        arielhasfins: 1992-07-21\r\
        Nanako: 1994-08-18\r\
        WARBIRD199: 1994-12-19\r\
        bluedinosaursocks: 1995-01-07\r\
        Meep: 1995-01-17");

        // !time
        if (e.message.content == "!time")
        e.message.channel.sendMessage("List of Moderator Timezones:\r\r\
        America/Phoenix: " + Moment().tz('America/Phoenix').format('YYYY/MM/DD | HH:mm:ss zz') + "\r\
        America/Chicago: " + Moment().tz('America/Chicago').format('YYYY/MM/DD | HH:mm:ss zz') + "\r\
        America/New_York: " + Moment().tz('America/New_York').format('YYYY/MM/DD | HH:mm:ss zz') + "\r\
        Asia/Singapore: " + Moment().tz('Asia/Singapore').format('YYYY/MM/DD | HH:mm:ss zz'))
      }
    }
  });

  // if connection is lost to Discord, issue a reconnect.

  client.Dispatcher.on(Events.DISCONNECTED, e => {
    // force disconnection to Discord
    client.disconnect();
    logcon.info('Disconnected from server ...');

    // reconnect to Discord
    logcon.info('Reconnecting to Discord ... ');
    client.connect({
      token: config.bot_token
    });
  });

  // also, reconnect the bot hourly.

  setInterval(function() {
    logcon.info('Reconnecting to server per timeout of ' + config.reconnect + 'ms.');
    client.disconnect();
    client.connect({
      token: config.bot_token
    });
  }, config.reconnect);
