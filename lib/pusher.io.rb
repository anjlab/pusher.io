require 'pusher.io/version'
require 'openssl'
require 'net/http'
require 'net/https'

require "pusher.io/engine" if defined? Rails

module Pusher
  module IO

    class Channel
      attr_reader :name

      def initialize name
        @name = name.to_s
      end

      def trigger event, data={}
        cfg = Pusher::IO.config

        msg = {
          app_id: cfg[:app_id].to_s,
          channel: name,
          event: event.to_s,
          data: data,
          timestamp: Time.now.utc.to_i
        }

        sig = Pusher::IO.psignature([
          'POST',
          'events',
          msg[:app_id],
          msg[:channel],
          msg[:event],
          msg[:timestamp],
          cfg[:key],
          cfg[:host]
        ])

        msg[:signature] = sig

        form = Net::HTTP::Post.new('/events')
        form["Content-Type"] = "application/json"
        form.body = msg.to_json

        http = Net::HTTP.new(cfg[:host], cfg[:port])
        http.use_ssl = cfg[:ssl_key].present?
        http.start {|h| h.request(form)}
      end
    end

    class << self
      def config
        @config ||= begin
          cfg = {}
          filename = "#{Rails.root}/config/pusher.io.yml"
          yaml = YAML.load_file(filename)[Rails.env]
          raise ArgumentError, "The #{Rails.env} environment does not exist in #{filename}" if yaml.nil?
          yaml.each { |k, v| cfg[k.to_sym] = v }
          cfg
        end
      end

      def psignature(params)
        OpenSSL::HMAC.hexdigest('sha1', config[:secret], params.join("\n"))
      end

      def io_auth_query
        args = [
          'auth',
          config[:app_id],
          Time.now.utc.to_i,
          config[:key]
        ]
        sign = psignature(args)
        args << sign
        query = ""
        [:pusher, :app_id, :timestamp, :key, :signature].zip(args) do |key, value|
          query << "&#{key}=#{value}"
        end
        query
      end

      def socket_base_uri
        return config[:base_uri] if config[:base_uri]

        uri = config[:ssl_key].present? ? "https" : "http"
        uri << "://#{config[:host]}"
        uri << ":#{config[:port]}" if config[:port] && config[:port] != 80
        uri
      end

      def socket_uri
        socket_base_uri + "?#{io_auth_query}"
      end

      def socket_js_uri
        socket_base_uri + "/socket.io/socket.io.js"
      end

      def [] channel_name
        Channel.new channel_name
      end
    end
  end
end
