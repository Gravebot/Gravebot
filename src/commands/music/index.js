import Promise from 'bluebird';
import R from 'ramda';
import ytdl from 'ytdl-core';

import { addSong, delSong, delSongs, getSong, getSongs, getNextSong } from '../../redis';
import { time } from '../../helpers';
// import T from '../../translate';

let timer;


function vleave(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    info.voiceConnection.disconnect();
    delSongs(evt.message.guild.id);
    delSong(evt.message.guild.id);
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function vjoin(client, evt, suffix) {
  if (!suffix) {
    const channel = evt.message.guild.voiceChannels.filter(vc => vc.members.map(m => m.id).indexOf(evt.message.author.id) > -1);
    if (channel.length > 0) {
      channel[0].join();
      timer = setTimeout(vleave, 1200000, client, evt);
    } else {
      return Promise.resolve('Channel not found. Please write the exact name of the channel or join it.');
    }
  } else {
    const channel = evt.message.guild.voiceChannels.find(c => c.name.toLowerCase() === suffix.toLowerCase());
    if (channel) {
      channel.join();
      timer = setTimeout(vleave, 1200000, client, evt);
    } else {
      return Promise.resolve('Channel not found. Please write the exact name of the channel or join it.');
    }
  }
}

function play(client, evt, music) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve('Not connected to a voice channel.');
  const encoder = info.voiceConnection.createExternalEncoder({
    type: 'ffmpeg',
    realtime: true,
    source: music.url,
    outputArgs: ['-compression_level', 7]
  });
  clearTimeout(timer);
  encoder.play();
  encoder.once('end', () => {
    delSong(evt.message.guild.id);
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (song) {
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000, client, evt);
        return Promise.resolve('No more songs in Queue.');
      }
    });
  });
}

function request(client, evt, suffix) {
  if (!suffix) return Promise.resolve('Usage: **`!request`** `Youtube URL`');
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve('Not connected to a voice channel.');
  if (suffix.indexOf('youtube.com/playlist') !== -1) return Promise.resolve('Playlist support coming soon');
  return ytdl.getInfo(suffix, ['-f', 'bestaudio'], (err, media) => {
    if (err) throw err;
    if (!media) return 'Invalid or not supported Youtube URL. Please make sure the Youtube URL starts with `http` or `https`.';
    if (media.length_seconds > 5400) return 'Maximum length is 90 minutes.';
    const formats = media.formats.filter(f => f.container === 'webm').sort((a, b) => b.audioBitrate - a.audioBitrate);
    const bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);
    if (!bestaudio) return 'Video unavailable.';
    const music = {
      user: evt.message.author.username,
      title: media.title,
      duration: media.length_seconds,
      url: bestaudio.url
    };
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (!song) {
        addSong(evt.message.guild.id, music);
        play(client, evt, music);
      } else {
        addSong(evt.message.guild.id, music);
      }
    });
    return Promise.resolve(`\`${media.title}\` has been added to the Queue.`);
  });
}

function stop(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    timer = setTimeout(vleave, 1200000, client, evt);
    info.voiceConnection.getEncoderStream().unpipeAll();
    delSongs(evt.message.guild.id);
    delSong(evt.message.guild.id);
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function skip(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    info.voiceConnection.getEncoderStream().unpipeAll();
    delSong(evt.message.guild.id);
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (song) {
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000, client, evt);
        return Promise.resolve('No more songs in Queue.');
      }
    });
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function pause(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    timer = setTimeout(vleave, 1200000, client, evt);
    info.voiceConnection.getEncoderStream().unpipeAll();
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function resume(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (song) {
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000, client, evt);
        return Promise.resolve('No more songs in Queue.');
      }
    });
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function playing(client, evt) {
  getSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`\`${song.title} ${time(song.duration)}\` - Requested by ${song.user}`);
    if (!song) return Promise.resolve('Nothing is playing.');
  });
}

function next(client, evt) {
  getNextSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`\`${song.title} ${time(song.duration)}\` - Requested by ${song.user}`);
    if (!song) return Promise.resolve('No more songs in Queue.');
  });
}

function queue(client, evt) {
  getSongs(evt.message.guild.id, (err, songs) => {
    if (err) throw err;
    let msg_array = [];
    R.forEach(song => {
      msg_array.push(`\`${song.title} ${time(song.duration)}\` - requested by ${song.user}`);
    }, songs);
    return Promise.resolve(msg_array.join('\n'));
  });
}

export default {
  currentlyplaying: playing,
  joinvoice: vjoin,
  leave: stop,
  next,
  nextsong: next,
  pause,
  play: request,
  playing,
  playlist: queue,
  queue,
  request,
  resume,
  skip,
  skipsong: skip,
  songname: playing,
  stop,
  vjoin,
  vleave: stop
};

export const help = {
  next: {},
  pause: {},
  playing: {},
  queue: {},
  request: {parameters: 'Youtube URL'},
  resume: {},
  skip: {},
  stop: {},
  vjoin: {parameters: 'channelname'}
};
