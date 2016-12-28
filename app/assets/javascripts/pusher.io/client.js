pusher = {}

!function ($) {

  "use strict";

  var channels = {};

  var Channel = function (name, socket_uri) {
    this.socket = io.connect(socket_uri);
    this.channelName = name;
    this.subscribed = false;

    var self = this;
    this.socket.on('reconnect', function() {
      self.subscribed = false;
      self.subscribe();
    });
  }

  Channel.prototype.subscribe = function() {
    if (this.subscribed) {
      return this;
    }

    this.socket.emit('subscribe', {channel: this.channelName});
    this.subscribed = true;
    return this;
  }

  Channel.prototype.unsubscribe = function () {
    if (!this.subscribed) {
      return this;
    }

    this.socket.emit('unsubscribe', {channel: this.channelName})
    this.subscribed = false;
    delete channels[this.channelName];
    return this;
  }

  Channel.prototype.on = function (event, callback) {
    this.socket.on('pusher:' + event, callback);
  }

  Channel.prototype.bind = Channel.prototype.on;

  Channel.prototype.off = function (event) {
    this.socket.off('pusher:' + event);
  }

  Channel.prototype.unbind = Channel.prototype.off;

  pusher.channel = function (name) {
    var channel = channels[name];
    if (!channel) {
      var socket_uri = $('meta[name="socket_uri"]').attr('content');
      channel = channels[name] = new Channel(name, socket_uri);
    }
    return channel;
  }

  pusher.subscribe = function (name) {
    return this.channel(name).subscribe();
  }

  pusher.unsubscribe = function (name) {
    return this.channel(name).unsubscribe();
  }

}(window.jQuery);
