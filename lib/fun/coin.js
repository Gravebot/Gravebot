function coin(bot, msg) {
  let number = Math.floor(Math.random() * 2) + 1;
  if (number === 1) {
    bot.sendFile(msg.channel, './images/Heads.png');
  } else {
    bot.sendFile(msg.channel, './images/Tails.png');
  }
}

export default {
  coin,
  coinflip: coin,
  flip: coin,
  flipcoin: coin
};
