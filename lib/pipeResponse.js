var _ = require('lodash');
var ansi = require('ansi-html-stream');
var fs = require('fs');
var http = require('http');
var path = require('path');
var replaceStream = require('replacestream');
var os = require('os');

var defaultConfig = {
  contentType: 'text/html',
  scrollDownInterval: 1000,
  autoscroll: true,
  backgroundColor: '#000000',
  foregroundColor: '#ffffff',
  tabLength: 4,
  tabReplace: '&nbsp;&nbsp;&nbsp;&nbsp;',
  disableTabReplace: false,
  newlineReplace: '<br />',
  disableNewlineReplace: false,
  ansi: true,
  ansiOptions: {
    foregrounds: {
      '30': { style: 'color:#fffaaa' } // black
    },
    backgrounds: {
      '40': { style: 'background-color:#fffaaa' } // black
    }
  },
  serverTimeout: 0,
  command: undefined
};
exports.defaultConfig = defaultConfig;

function defaults(obj, def) {
  var ret = (Array.isArray(obj || def) ? [] : {});
  for (var field in obj) {
    if (obj.hasOwnProperty(field)) {
      if (typeof obj[field] === 'object') {
        ret[field] = defaults(obj[field], null);
      } else {
        ret[field] = obj[field];
      }
    }
  }
  for (field in def) {
    if (def.hasOwnProperty(field)) {
      if (typeof def[field] === 'object') {
        ret[field] = defaults(ret[field], def[field]);
      } else {
        if (!ret.hasOwnProperty(field)) {
          ret[field] = def[field];
        }
      }
    }
  }
  return ret;
}

var html_template = _.template(fs.readFileSync(path.join(__dirname, '../client/client.html'), 'utf8'));
var script = fs.readFileSync(path.join(__dirname, '../client/client.js'), 'utf8');

function pipeResponse(config, response, stream) {
  if (config instanceof http.OutgoingMessage) {
    stream = response;
    response = config;
    config = {};
  }
  config = defaults(config, defaultConfig);
  var contentType = config.contentType;

  var bg = config.backgroundColor;
  var fg = config.foregroundColor;

  if (config.ansi) {
    contentType = 'text/html';
    stream = stream.pipe(ansi(config.ansiOptions));
  }

  if (!config.disableTabReplace) {
    var tab = '';
    for (var i = 0; i < config.tabLength; i++) {
      tab += ' ';
    }

    var tabStream = replaceStream(tab, config.tabReplace);
    stream = stream.pipe(tabStream);
  }

  if (!config.disableNewlineReplace) {
    var osNewLineStream = replaceStream(os.EOL, config.newlineReplace);
    var newLineStream = replaceStream('\n', config.newlineReplace);

    stream = stream.pipe(osNewLineStream).pipe(newLineStream);
  }

  response.setHeader('Content-Type', contentType);

  if (contentType === 'text/html') {

    var clientConfig = {
      scrollDownInterval: config.scrollDownInterval,
      autoscroll: config.autoscroll
    };
    var html = html_template({
      bg: bg,
      fg: fg,
      autoscroll: config.autoscroll,
      clientConfig: JSON.stringify(clientConfig),
      script: script
    });

    response.write(html);
  }

  stream.pipe(response);
}
exports.pipeResponse = pipeResponse;
