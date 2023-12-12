class Robot < ApplicationRecord
  has_one :robot_status, -> { order(created_at: :desc) }

  def self.turn_on(robot_id)
    Robot.find_or_create_by(robot_id:).turn_on
  end

  def self.turn_off(robot_id)
    Robot.find_or_create_by(robot_id:).turn_off
  end

  def turn_on
    self.status = "online"
  end

  def turn_off
    self.status = "offline"
  end

  def status
    robot_status.status
  end

  private


  def status=(type)
    if robot_status&.status != type
      RobotStatus.create(robot: self, status: type)
    end
  end
end
