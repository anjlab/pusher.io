module Pusher::IO
  module ViewHelpers
    def pusher_io_tags
      [
        pusher_io_socket_uri,
        pusher_io_socket_client
      ].join.html_safe
    end

    def pusher_io_socket_client
      javascript_include_tag Pusher::IO.socket_js_uri
    end

    def pusher_io_socket_uri
      tag :meta, name: 'socket_uri', content: Pusher::IO.socket_uri
    end
  end
end
