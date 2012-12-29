module Pusher::IO
  module Generators
    class InstallGenerator < Rails::Generators::Base
      def self.namespace
        "pusher.io:install"
      end

      def self.source_root
        File.dirname(__FILE__) + '/templates'
      end

      def copy_files
        template 'pusher.io.yml', 'config/pusher.io.yml'
        copy_file 'pusher.io.js', 'pusher.io.js'
        copy_file 'package.json', 'package.json'
      end

      def npm_install
        run "npm install"
      end
    end
  end
end