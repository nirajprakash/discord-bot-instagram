
import { MessageEmbed, Client, Intents, AnyChannel } from "discord.js";
import { config } from 'dotenv';
import { Instagram, ModelInstagram, ModelMe } from "./instagram";

import path from 'path';
//).config();

config();
const TOKEN = process.env.BOT_TOKEN;

// at the top of your file
// const { MessageEmbed } = require('discord.js');
console.log("Tpoken: ", TOKEN)

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); //create new client

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

  // console.log("emssage: ", msg);
  if (msg.content.includes("Insta Eater") || msg.content.includes("Insta-Eater") || msg.content.includes("Insta-eater")) {
    // msg.reply("What's up! Human. Don't disturb me, I am still evolving. wait for some days .. :sleeping:");

    new Instagram().feeds().then((post?: ModelInstagram) => {

      if (post) {
        console.log("feeds post: ", post)


        embedMessage(post, msg.channel).then(() => {

        })
      }
    });
    // msg.channel.send('Pong!');
  }
});

var embedMessage = async (post: ModelInstagram, channel: any) => {

  var  me: ModelMe = {
    username:"",
    profileUrl:""

  }
  try {
    me = require(path.join(__dirname, `./../public/me.json`));

}catch(e){

}
  // inside a command, event listener, etc.
  const exampleEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(me.username)
    .setURL(post.permalink)
    //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription(post.caption)
    .setThumbnail(post.thumbnail_url)
    // .addFields(
    //   { name: 'Regular field title', value: 'Some value here' },
    //   { name: '\u200B', value: '\u200B' },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    //   { name: 'Inline field title', value: 'Some value here', inline: true },
    // )
    // .addField('Inline field title', 'Some value here', true)
    .setImage(post.media_url)
    .setTimestamp()
    .setFooter({ text: 'Follow', iconURL: me.profileUrl });

  await channel.send({ embeds: [exampleEmbed] }).then((sds) => {
    // console.log("sds: ", sds)
  });


}

// client.on('messageCreate', msg => {

//   // console.log("emssage 1: ", msg);
//   if (msg.content === 'ping') {
//     msg.reply('Pong!');
//     msg.channel.send('Pong!');
//   }

// });

//make sure this line is the last line
client.login(TOKEN); //login bot using token




// inside a command, event listener, etc.
// const exampleEmbed = new MessageEmbed()
// 	.setColor('#0099ff')
// 	.setTitle('Some title')
// 	.setURL('https://discord.js.org/')
// 	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
// 	.setDescription('Some description here')
// 	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
// 	.addFields(
// 		{ name: 'Regular field title', value: 'Some value here' },
// 		{ name: '\u200B', value: '\u200B' },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	)
// 	.addField('Inline field title', 'Some value here', true)
// 	.setImage('https://i.imgur.com/AfFp7pu.png')
// 	.setTimestamp()
// 	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

// channel.send({ embeds: [exampleEmbed] });