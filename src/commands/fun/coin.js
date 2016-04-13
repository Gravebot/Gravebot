function coin(client, e) {
  const number = Math.floor(Math.random() * 2) + 1;
  if (number === 1) {
    e.message.channel.uploadFile('./images/Heads.png');
  } else {
    e.message.channel.uploadFile('./images/Tails.png');
  }
}

export default {
  coin,
  coinflip: coin,
  flip: coin,
  flipcoin: coin
};

export const help = {
  coin: {}
};
