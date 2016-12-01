import Promise from 'bluebird';
import youtubedl from 'youtube-dl';

import { addSong, getSong } from '../../redis';
// import T from '../../translate';


function vjoin(client, evt, suffix) {
  if (!suffix) {
    let channel = evt.message.guild.voiceChannels.filter(vc => vc.members.map(m => m.id).indexOf(evt.message.author.id) > -1);
    if (channel.length > 0) {
      channel[0].join();
    } else {
      return Promise.resolve('Channel not found. Please write the exact name of the channel or join it.');
    }
  } else {
    let channel = evt.message.guild.voiceChannels.find(c => c.name.toLowerCase() === suffix.toLowerCase());
    if (channel) {
      channel.join();
    } else {
      return Promise.resolve('Channel not found. Please write the exact name of the channel or join it.');
    }
  }
}

function next(client, evt) {

}

function play(client, evt, music) {
  let info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve('Not connected to a voice channel. Use `!vjoin`');
  let encoder = info.voiceConnection.createExternalEncoder({
    type: 'ffmpeg',
    realtime: true,
    source: music.url,
    outputArgs: ['-compression_level', 7]
  });
  encoder.play();
  encoder.once('end', () => {
    getSong(evt.message.guild.id).then(music => {
      if (music) play(client, evt, JSON.parse(music));
    });
  });
}

function playing(client, evt) {

}

function queue(client, evt) {

}

function request(client, evt, suffix) {
  if (!suffix) return Promise.resolve('Usage: **`!request`** `URL`');
  return youtubedl.getInfo(suffix, ['-f', 'bestaudio'], (err, media) => {
    if (!media) return 'Invalid or not supported URL. Please make sure the URL starts with `http` or `https`.';
    if (media.duration.replace(/:/g, '') > 13000) return 'Maximum length is 90 minutes.';
    if (err) throw err;
    let music = {
      user: evt.message.author.username,
      title: media.title,
      duration: media.duration,
      url: media.url
    };
    addSong(evt.message.guild.id, music);
    getSong(evt.message.guild.id).then(music => {
      if (music) play(client, evt, JSON.parse(music));
    });
    return `\`${media.title}\` has been added to the Queue.`;
  });
}

function skip(client, evt) {

}

function stop(client, evt) {
  let info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    info.voiceConnection.getEncoderStream().unpipeAll();
  } else {
    return Promise.resolve('Not connected to a voice channel. Use `!join`');
  }
}

// Placeholder command
function music(client, evt) {
  return Promise.resolve(`
**\`!request\`** \`URL\`
  Request a song to be played
**\`!vjoin\`** \`channelname\`
Joins the channel the user is in, unless a name is specified
**\`!skip\`**
Skips the currently playing song
`);
}

export const help = {
  vjoin: {parameters: ['channelname']},
  next: {},
  queue: {},
  playing: {},
  request: {parameters: ['URL']},
  skip: {},
  stop: {}
};

export default {
  currentlyplaying: playing,
  joinvoice: vjoin,
  next,
  nextsong: next,
  play: request,
  playing,
  playlist: queue,
  queue,
  request,
  skip,
  skipsong: skip,
  songname: playing,
  stop,
  vjoin,
  music
};
