import DiscordJS from 'discord.js';
import { config} from 'dotenv';
config();
import ecoWatt from './components/ecowatt/ecowatt.js';
import genEmbed from './components/genEmbed/genEmbed.js';
import fs from 'fs';

//load channelList.json file
let channelList = {
  "channels": [
    {
      "serverid": "123456789",
      "serverName": "server1",
      "id": "123456789",
      "name": "channel1"
    },
  ]
};
try {
  channelList = JSON.parse(fs.readFileSync('./channelList.json', 'utf8'));
} catch (err) {
  console.error(err)
}

const client = new  DiscordJS.Client({
  intents: [
      DiscordJS.GatewayIntentBits.Guilds,
      DiscordJS.GatewayIntentBits.GuildMessages,
      DiscordJS.GatewayIntentBits.MessageContent,
      DiscordJS.GatewayIntentBits.GuildMembers,
      DiscordJS.GatewayIntentBits.DirectMessages,
  ],
});
const MyecoWatt = new ecoWatt();
MyecoWatt.login();

client.on('ready', () => {
  // console.log with color green 
  console.log('\x1b[32m%s\x1b[0m', `Connecté en tant que ${client.user.tag}!`);
  //set bot status
  client.user.setActivity('eco!help', { type: 'PLAYING' });

});

let prefix = process.env.PREFIX;

client.on('messageCreate', async (message) => {
  //console.log(message.content);
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'watt':
      const data = await MyecoWatt.getEcoWattData();
      const embeds = genEmbed(data);
      //send all embeds in one message
      message.channel.send({embeds: embeds});
/*       embeds.forEach(embed => {
        message.channel.send({embeds: [embed]});
      }); */
      break;
    case 'addchannel':
      if (message.member.permissions.has('ADMINISTRATOR')) {
        const channel = message.channel;
        const server = message.guild;
        const serverid = server.id;
        const serverName = server.name;
        const id = channel.id;
        const name = channel.name;
        //check if channel already exists
        const channelExists = channelList.channels.find(channel => channel.id === id);
        if (channelExists) {
          message.channel.send(`Le channel ${name} existe déjà dans la liste des channels`);
          return;
        }
        const newChannel = {
          "serverid": serverid,
          "serverName": serverName,
          "id": id,
          "name": name
        };
        channelList.channels.push(newChannel);
        fs.writeFile('./channelList.json', JSON.stringify(channelList), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        message.channel.send(`Le channel ${name} a bien été ajouté à la liste des channels`);
        return;
      }
      message.channel.send(`Vous n'avez pas les droits pour ajouter un channel`);
      break;
    case 'removechannel':
      if (message.member.permissions.has('ADMINISTRATOR')) {
        const channel = message.channel;
        const id = channel.id;
        const name = channel.name;
        //check if channel already exists
        const channelExists = channelList.channels.find(channel => channel.id === id);
        if (!channelExists) {
          message.channel.send(`Le channel ${name} n'existe pas dans la liste des channels`);
          return;
        }
        channelList.channels = channelList.channels.filter(channel => channel.id !== id);
        fs.writeFile('./channelList.json', JSON.stringify(channelList), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        message.channel.send(`Le channel ${name} a bien été supprimé de la liste des channels`);
        return;
      }
      message.channel.send(`Vous n'avez pas les droits pour supprimer un channel`);
      break;
    case 'help':
      message.channel.send(`Liste des commandes :
      eco!watt : affiche les données de situation de toute la France
      eco!addchannel : ajoute le channel courant à la liste des channels
      eco!removechannel : supprime le channel courant de la liste des channels`);
      break;
    default:
      message.channel.send(`Commande inconnue : ${command} faites eco!help pour voir la liste des commandes`);
      break;
  }
  return;

});

// every 30 minutes, delete all messages in the channel and send new embeds
setInterval(async () => {
  channelList.channels.forEach(channel => {
    const channelid = channel.id;
    const channelName = channel.name;
    const serverName = channel.serverName;
    const serverid = channel.serverid;
    const channelObj = client.channels.cache.get(channelid);
    if (channelObj) {
      channelObj.messages.fetch().then(messages => {
        const filteredMessages = messages.filter(message => message.createdTimestamp > (Date.now() - 1209600000));
        channelObj.bulkDelete(filteredMessages);
        MyecoWatt.getEcoWattData().then(data => {
          const embeds = genEmbed(data);
          embeds.forEach(embed => {
            channelObj.send({embeds: [embed]});
          });
        });
      });
    } else {
      console.log(`Le channel ${channelName} du serveur ${serverName} n'existe plus`);
      //remove channel from channelList
      channelList.channels = channelList.channels.filter(channel => channel.id !== channelid);
      fs.writeFile('./channelList.json', JSON.stringify(channelList), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  });
}, 1800000);
//1800000



client.login(process.env.DSTOKEN);