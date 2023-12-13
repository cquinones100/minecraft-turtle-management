class DashboardController < ApplicationController
  def index
    @robots = Robot.all.map do |robot|
      {
        robot_id: robot.robot_id,
        status: robot.status,
      }
    end
  end
end
