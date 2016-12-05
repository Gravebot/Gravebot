import Promise from 'bluebird';
import youtubedl from 'youtube-dl';

import { addSong, delSong, delSongs, getSong, getSongs, getNextSong } from '../../redis';
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
      timer = setTimeout(vleave, 1200000);
    } else {
      return Promise.resolve('Channel not found. Please write the exact name of the channel or join it.');
    }
  } else {
    const channel = evt.message.guild.voiceChannels.find(c => c.name.toLowerCase() === suffix.toLowerCase());
    if (channel) {
      channel.join();
      timer = setTimeout(vleave, 1200000);
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
  encoder.play();
  encoder.once('end', () => {
    delSong(evt.message.guild.id);
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (song) {
        clearTimeout(timer);
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000);
        return Promise.resolve('No more songs in Queue.');
      }
    });
  });
}

function request(client, evt, suffix) {
  if (!suffix) return Promise.resolve('Usage: **`!request`** `URL`');
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (!info) return Promise.resolve('Not connected to a voice channel.');
  return youtubedl.getInfo(suffix, ['-f', 'bestaudio'], (err, media) => {
    if (!media) return 'Invalid or not supported URL. Please make sure the URL starts with `http` or `https`.';
    if (media.duration.replace(/:/g, '') > 13000) return 'Maximum length is 90 minutes.';
    if (err) throw err;
    const music = {
      user: evt.message.author.username,
      title: media.title,
      duration: media.duration,
      url: media.url
    };
    getSong(evt.message.guild.id, (err, song) => {
      if (err) throw err;
      if (!song) {
        addSong(evt.message.guild.id, music);
        play(client, evt, music);
        clearTimeout(timer);
      } else {
        addSong(evt.message.guild.id, music);
      }
    });
    return `\`${media.title}\` has been added to the Queue.`;
  });
}

function stop(client, evt) {
  const info = client.VoiceConnections.getForGuild(evt.message.guild);
  if (info) {
    timer = setTimeout(vleave, 1200000);
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
        clearTimeout(timer);
        play(client, evt, JSON.parse(song));
      } else {
        timer = setTimeout(vleave, 1200000);
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
    timer = setTimeout(vleave, 1200000);
    info.voiceConnection.getEncoderStream().unpipeAll();
  } else {
    return Promise.resolve('Not connected to a voice channel.');
  }
}

function resume(client, evt) {
  getSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) {
      clearTimeout(timer);
      play(client, evt, JSON.parse(song));
    } else {
      timer = setTimeout(vleave, 1200000);
      return Promise.resolve('No more songs in Queue.');
    }
  });
}

function playing(client, evt) {
  getSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`${song.title} - Requested by ${song.user}`);
    if (!song) return Promise.resolve('Nothing is playing.');
  });
}

function next(client, evt) {
  getNextSong(evt.message.guild.id, (err, song) => {
    if (err) throw err;
    if (song) return Promise.resolve(`${song.title} - Requested by ${song.user}`);
    if (!song) return Promise.resolve('No more songs in Queue.');
  });
}

function queue(client, evt) {
  getSongs(evt.message.guild.id, (err, songs) => {
    if (err) throw err;
    console.log(songs);
  });
}

// Placeholder command
function music(client, evt) {
  return Promise.resolve(`
**\`!vjoin\`** \`channelname\`
  Joins the voice channel the user is in, unless a name is specified
**\`!vleave\`**
  Leaves the voice channel
**\`!request\`** \`URL\`
  Request a song to be played
**\`!skip\`**
  Skips a song
**\`!stop\`**
  Stops the playback and deletes all songs from the Queue
**\`!pause\`**
  Pauses the playback
**\`!resume\`**
  Resumes the playback
**\`!playing\`**
  Shows the currently playing song
**\`!next\`**
  Shows the song that will play next
**\`!queue\`**
  Shows the song queue
`);
}

export const help = {
  next: {},
  pause: {},
  playing: {},
  queue: {},
  request: {parameters: ['URL']},
  resume: {},
  skip: {},
  stop: {},
  vjoin: {parameters: ['channelname']},
  vleave: {}
};

export default {
  currentlyplaying: playing,
  joinvoice: vjoin,
  leave: vleave,
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
  vleave,
  vplay: play, // Left for debugging
  music // Placeholder command
};
