# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pusher.io/version'

Gem::Specification.new do |gem|
  gem.name          = "pusher.io"
  gem.version       = Pusher::IO::VERSION
  gem.authors       = ["yury"]
  gem.email         = ["yury.korolev@gmail.com"]
  gem.description   = %q{Very basic implementation of pusherapp.com api subset on top of socket.io.}
  gem.summary       = %q{Socket.io for rails}
  gem.homepage      = "https://github.com/anjlab/pusher.io"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
