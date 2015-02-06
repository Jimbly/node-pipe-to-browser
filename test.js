var inspect = require('eyes').inspector(/*{ stream: null }*/);

console.error('stderr');

var obj = {
  x: 1,
  y: 2,
  f: {
    g: 3,
    z: 9
  }
};

console.log('abcdefg foo bar');
inspect(obj);

setInterval(function () {
  inspect(obj);
}, 1000);
