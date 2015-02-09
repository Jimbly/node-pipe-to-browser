# node-pipe-to-browser
Pipe to the browser library, very useful for log tailing.

node-pipe-to-browser features auto scrolling (with enable/disable), ansi to html coloring (--ansi) and behavior and color customization.

Originally a fork from [kessler/node-bcat](https://github.com/kessler/node-bcat), reworked as a library interface instead of just a command line tool.  Ideal for adding a route to your servers that gives you streaming access to your logs.

# Library usage
You can use pipe-to-browser as a library to pipe an arbitrary stream to a http response:
```
var pipe_to_browser = require('./')
var fs = require('fs')

var http = require('http')
var config = {/* most any option from above, see lib/pipeResponse.js */}
http.createServer(function (req, res) {
  var file = fs.createReadStream('./test.html')
  // Or: var file = require('child_process').spawn('tail', ['-c', '+0', '-f', './test.html']).stdout
  pipe_to_browser.pipeResponse(confg, res, file)
  // See testlib.js for a more full example and notes about caveats of spawning 'tail' processes
}).listen(1337, '127.0.0.1')
```

# Command-line utility mode

You can also use pipe-to-browser as a stand-alone command line utility. This module uses [RC](https://github.com/dominictarr/rc) to manage its configuration, so in addition to command line arguments you may save your favorite configuration in .pipe-to-browserrc.

## example
```
> npm install -g pipe-to-browser

> cat somefile | pipe-to-browser

// redirect error stream also
> node index.js 2>&1 | pipe-to-browser
```
Want to see something moving too?

test.js:
```js
setInterval(function () {
	console.log(1)
}, 1000)
```
then
```
> node test.js | pipe-to-browser
```
![screenshot](https://raw.github.com/kessler/static/master/node-bcat.png)

## usage
```
 --port                   set a port for this pipe-to-browser execution
 --contentType            content type header, must be lower case      [default: "text/html"]
 --backgroundColor        (only in text/html)                          [default: "#000000"]
 --foregroundColor        (only in text/html)                          [default: "#ffffff"]
 --tabLength              length of a tab in spaces                    [default: 4]
 --tabReplace             tab replacement                              [default: "&nbsp;&nbsp;&nbsp;&nbsp;"
 --disableTabReplace      disable tab replacement                      [default: false]
 --newlineReplace         new line replacement                         [default: "<br />"
 --disableNewlineReplace  disable new line replacement                 [default: false]
 --ansi                   show colorful ansi (implies text/html)       [default: true]
 --ansiOptions            override replacement of ansi black color
 --scrollDownInterval     interval to execute javascript scroll down   [default: 1000 (ms)]
 --serverTimeout          http://nodejs.org/api/http.html#http_server_timeout  [default: 0 (no timeout)]
```
- _An available port between 8080 - 8181 will be automatically picked if --port is not specified_
- _ansi feature is on by default_

![be a good cat](https://raw.github.com/kessler/static/master/bcat.jpg)

## related
[node-bcat](https://github.com/kessler/node-bcat) - original command-line-only

[scat](https://github.com/hughsk/scat) - pipes javascript into your browser

[hcat](https://github.com/kessler/node-hcat) - pipes html into your browser

[bpipe](https://github.com/Marak/bpipe) - bidirectional piping between unix and the browser
