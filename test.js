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
for (var ii = 0; ii < 20; ++ii) {
  obj.r = Math.random();
  inspect(obj);
}

setInterval(function () {
  obj.r = Math.random();
  inspect(obj);
}, 1000);
