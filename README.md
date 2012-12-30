# pusher.io gem

This is very basic implementation of subset of pusherapp.com api on top of socket.io.

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

## Usage

Include pusher io tags in your html head:

    <%= pusher_io_tags %>

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
