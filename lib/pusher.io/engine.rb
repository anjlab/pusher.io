require 'pusher.io/view_helpers'

module Pusher::IO
  class Engine < Rails::Engine
    # Adds the ViewHelpers into ActionView::Base
    initializer "pusher_io.view_helpers" do
      ActionView::Base.send :include, ViewHelpers
    end
  end
end