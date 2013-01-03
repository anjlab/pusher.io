# pusher.io gem

This is very basic implementation of pusherapp.com api subset on top of socket.io.

## Setup

Add the gem to your Gemfile and run the bundle command to install it.

    gem 'pusher.io'

Run the generator to create the initial files.

    $ rails g pusher.io:install

Next, start up pusher.io.

    $ node pusher.io.js

For production

    $ NODE_ENV=production node pusher.io.js

Add the JavaScript file to your application.js file manifest.

    // require pusher.io/client
    
See [socket.io docs](https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO) for Redis config.
Make your changes in pusher.io.js

Easy *SSL* support. Just add `ssl_key` and `ssl_cert` paths to your env in config/pusher.io.yml:

    production:
        ...
        ssl_key: "/path/to/server.pem"
        ssl_cert: "/path/to/certificate_chain.pem"
       

## Usage

Include pusher io tags in your html head:

    <%= pusher_io_tags %>
    
Browser side
    
    var channel = pusher.subscribe('notifications');
    channel.on('alert', function(data) {
        alert(data);
    });

    // or use bind
    channel.bind('alert', function(data) {
        alert(data);
    });
    
Server side

    Pusher::IO[:notifications].trigger 'alert', 'hello'

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
