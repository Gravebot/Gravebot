import youtubedl from 'youtube-dl';

import { addSong, getSong } from '../../redis';
import T from '../../translate';


function add() {
  addSong();
}

function retrieve() {
  getSong();
}

function join(client, evt, suffix) {
  if (!suffix) {
    let channel = evt.message.guild.voiceChannels.filter(vc => vc.members.map(m => m.id).indexOf(evt.message.author.id) > -1);
    if (channel.length > 0) {
      channel[0].join();
    } else {
      evt.message.reply('Channel not found. Please write the exact name of the channel or join it.');
    }
  } else {
    let channel = evt.message.guild.voiceChannels.find(c => c.name.toLowerCase() === suffix.toLowerCase());
    if (channel) {
      channel.join();
    } else {
      evt.message.reply('Channel not found. Please write the exact name of the channel or join it.');
    }
  }
}

function next() {

}

function play(client, evt, music) {
  let info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return evt.message.reply('Not connected to a voice channel. Use `!join`');
  let encoder = info.voiceConnection.createExternalEncoder({
    type: 'ffmpeg',
    realtime: true,
    source: music.url,
    outputArgs: ['-compression_level', 7]
  });
  encoder.play();
  encoder.once('end', () => console.log('end'));
}

function playing() {

}

function queue() {

}

function request(client, evt, suffix) {
  if (!suffix) return evt.message.reply('Usage: **`!request`** `URL`');
  youtubedl.getInfo(suffix, ['-f', 'bestaudio'], (err, media) => {
    if (!media) return evt.message.reply('Invalid or not supported URL. Please make sure the URL starts with `http` or `https`.');
    let music = {
      guild: evt.message.guild.id,
      user: evt.message.author.username,
      title: media.title,
      duration: media.duration,
      url: media.url
    };
    if (err) return console.log(err);
    play(client, evt, music);
  });
}

function skip() {

}

function stop(client, evt) {
  let info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    info.voiceConnection.getEncoderStream().unpipeAll();
  } else {
    evt.message.reply('Not connected to a voice channel. Use `!join`');
  }
}

export const help = {
  join: {},
  next: {},
  queue: {},
  playing: {},
  request: {},
  skip: {},
  stop: {}
};

export default {
  currentlyplaying: playing,
  join,
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
  stop
};
