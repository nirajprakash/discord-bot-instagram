import { ModelInstagram, ModelMe, ModelMessage } from "./models";

import path from 'path';
import { MessageEmbed } from "discord.js";

export const embedMessage = async (post: ModelInstagram, channel: any) => {

    var me: ModelMe = {
        username: "",
        profileUrl: ""

    }
    try {
        me = require(path.join(__dirname, `./../public/me.json`));

    } catch (e) {

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

export const parseMessage = (msg: string): ModelMessage => {

    var parsed = {

    }

    var msgList = msg.split(" ");

    if(msgList.length>0){
        
    }
    return parsed;
}