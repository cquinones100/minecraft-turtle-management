# frozen_string_literal: true

class DashboardController < ApplicationController
  def index
    @robots = Robot.all.map do |robot|
      {
        robot_id: robot.robot_id,
        status: robot.status,
        direction: robot.direction,
        coordinates: robot.coordinates
      }
    end
  end
end
