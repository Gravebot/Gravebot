import Promise from 'bluebird';
import R from 'ramda';
import ytdl from 'ytdl-core';

import { addSong, delSong, delSongs, getSong, getSongs, getNextSong } from '../../redis';
import { time } from '../../helpers';
import T from '../../translate';

let timer;


function vleave(client, evt, lang) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    info.voiceConnection.disconnect();
    delSongs(evt.message.guild.id);
    delSong(evt.message.guild.id);
  } else {
    return Promise.resolve(T('music_not_connected', lang));
  }
}

function vjoin(client, evt, suffix, lang) {
  if (!suffix) {
    const channel = evt.message.guild.voiceChannels.filter(vc => vc.members.map(m => m.id).indexOf(evt.message.author.id) > -1);
    if (channel.length > 0) {
      channel[0].join();
      timer = setTimeout(vleave, 1200000, client, evt);
    } else {
      return Promise.resolve(T('music_not_found', lang));
    }
  } else {
    const channel = evt.message.guild.voiceChannels.find(c => c.name.toLowerCase() === suffix.toLowerCase());
    if (channel) {
      channel.join();
      timer = setTimeout(vleave, 1200000, client, evt);
    } else {
      return Promise.resolve(T('music_not_found', lang));
    }
  }
}

function play(client, evt, music, lang) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve(T('music_not_connected', lang));
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
        return Promise.resolve(T('music_queue_empty', lang));
      }
    });
  });
}

function request(client, evt, suffix, lang) {
  if (!suffix) return Promise.resolve(T('request_usage', lang));
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve(T('music_not_connected', lang));
  if (suffix.indexOf('youtube.com/playlist') !== -1) return Promise.resolve('Playlist support coming soon');
  return ytdl.getInfo(suffix, ['-f', 'bestaudio'], (err, media) => {
    if (err) throw err;
    if (!media) return T('request_error', lang);
    if (media.length_seconds > 5400) return T('request_length', lang);
    const formats = media.formats.filter(f => f.container === 'webm').sort((a, b) => b.audioBitrate - a.audioBitrate);
    const bestaudio = formats.find(f => f.audioBitrate > 0 && !f.bitrate) || formats.find(f => f.audioBitrate > 0);
    if (!bestaudio) return T('request_unavailable', lang);
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
    return Promise.resolve(`\`${media.title}\` ${T('music_queue_added', lang)}`);
  });
}

function stop(client, evt, lang) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    timer = setTimeout(vleave, 1200000, client, evt);
    info.voiceConnection.getEncoderStream().unpipeAll();
    delSongs(evt.message.guild.id);
    delSong(evt.message.guild.id);
  } else {
    return Promise.resolve(T('music_not_connected', lang));
  }
}

function skip(client, evt, lang) {
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
        return Promise.resolve(T('music_queue_empty', lang));
      }
    });
  } else {
    return Promise.resolve(T('music_not_connected', lang));
  }
}

function pause(client, evt, lang) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    timer = setTimeout(vleave, 1200000, client, evt);
    info.voiceConnection.getEncoderStream().unpipeAll();
  } else {
    return Promise.resolve(T('music_not_connected', lang));
  }
}

function resume(client, evt, lang) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (song) {
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000, client, evt);
        return Promise.resolve(T('music_queue_empty', lang));
      }
    });
  } else {
    return Promise.resolve(T('music_not_connected', lang));
  }
}

function playing(client, evt, lang) {
  getSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`\`${song.title} ${time(song.duration)}\` - ${T('music_requested', lang)} ${song.user}`);
    if (!song) return Promise.resolve(T('music_queue_empty', lang));
  });
}

function next(client, evt, lang) {
  getNextSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`\`${song.title} ${time(song.duration)}\` - ${T('music_requested', lang)} ${song.user}`);
    if (!song) return Promise.resolve(T('music_queue_empty', lang));
  });
}

function queue(client, evt, lang) {
  getSongs(evt.message.guild.id, (err, songs) => {
    if (err) throw err;
    let msg_array = [];
    R.forEach(song => {
      msg_array.push(`\`${song.title} ${time(song.duration)}\` - ${T('music_requested', lang)} ${song.user}`);
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
