require('js-yaml');

env = process.env.NODE_ENV || 'development'

var cfg = require('./config/pusher.io.yml')[env];

var crypto = require('crypto')
  , hmac
  , signature

var psignature = function(params) {
  hmac = crypto.createHmac("sha1", cfg.secret);
  hmac.update(params.join("\n"))
  return hmac.digest("hex");
}

var fs      = require('fs')
  , express = require('express')
  , app     = express()
  , server
  , io

if (cfg['ssl_key'] && cfg['ssl_cert']) {

  server = require('https').createServer({
    key: fs.readFileSync(cfg['ssl_key']),
    cert: fs.readFileSync(cfg['ssl_cert'])
  }, app);
  
} else {
  server = require('http').createServer(app);
}

io = require('socket.io').listen(server);

app.use(express.bodyParser());

app.post('/events', function(req, res) {
  b = req.body
  var params = [
    'POST',
    'events',
    b.app_id,
    b.channel,
    b.event,
    b.timestamp,
    cfg.key,
    cfg.host
  ];

  if (psignature(params) == b.signature) {
    io.sockets.in(b.channel).emit('pusher:' + b.event, b.data);
    res.send({});
  } else {
    res.send(401);
  }
});

io.configure(function () {
  io.set('authorization', function (handshakeData, callback) {
    var params = [
      'auth',
      handshakeData.query.app_id,
      handshakeData.query.timestamp,
      cfg.key
    ];
    if (psignature(params) == handshakeData.query.signature) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
});

io.configure('production', function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.sockets.on('connection', function (socket) {
  socket.on('subscribe', function(data) {
    socket.join(data.channel);
  });
  socket.on('unsubscribe', function(data) {
    socket.leave(data.channel);
  });
});

server.listen(cfg.port);
console.log('started pusher.io ', env, cfg.host + ':' + cfg.port);