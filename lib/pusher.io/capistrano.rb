# Capistrano task for npm install.
#
# Just add "require 'pusher.io/capistrano'" in your Capistrano deploy.rb, and
# Pusher will be activated after each new deployment.

Capistrano::Configuration.instance(:must_exist).load do
  before "deploy:finalize_update", "pusher.io:install" do
    run "npm install"
  end
end