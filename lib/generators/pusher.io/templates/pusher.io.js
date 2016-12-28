var yaml = require('js-yaml'),
    fs = require('fs');

env = process.env.NODE_ENV || 'development'

var cfg = yaml.safeLoad(fs.readFileSync('./config/pusher.io.yml', 'utf8'))[env];

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

io = require('socket.io')(server);

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

app.post('/users', function(req, res) {
  if (req.body.key == cfg.key) {
    res.send({
      count: Object.keys(io.sockets.sockets).length
    });
  } else {
    res.send(401);
  }
});

io.use(function (socket, next) {
  var handshakeData = socket.handshake;
  var params = [
    'auth',
    handshakeData.query.app_id,
    handshakeData.query.timestamp,
    cfg.key
  ];
  if (psignature(params) == handshakeData.query.signature) {
    next();
  } else {
    next(new Error('not authorized'));
  }
});

io.on('connection', function (socket) {
  socket.on('subscribe', function(data) {
    socket.join(data.channel);
  });
  socket.on('unsubscribe', function(data) {
    socket.leave(data.channel);
  });
});

server.listen(cfg.port);
