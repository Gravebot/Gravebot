export function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function secondDec(n) {
  return Math.round(n * 100) / 100;
}

export function time(n) {
  const hours = n / 3600;
  const minutes = n / 60;
  const seconds = n - minutes * 60;
  return `[${hours > 0 ? hours`:` : ''}${minutes}:${seconds}]`;
}
