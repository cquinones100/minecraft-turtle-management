class SessionsController < ApplicationController
  def index
    session[:user_id] ||= SecureRandom.uuid

    @user_id = session[:user_id]

    ActionCable.server.broadcast("movement_channel", "Hello from the movement channel server!")
  end
end

