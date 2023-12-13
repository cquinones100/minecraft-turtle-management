class RobotChannel < ApplicationCable::Channel
  def subscribed
    if params[:dashboard]
      puts "Dashboard subscribed to RobotChannel"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
