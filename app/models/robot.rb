class Robot < ApplicationRecord
  has_one :robot_status, -> { order(created_at: :desc) }, dependent: :destroy
  has_one :robot_coordinate, -> { order(created_at: :desc) }, dependent: :destroy
  has_one :mia, -> { where(active: true).order(created_at: :desc) }

  validates :robot_id, presence: true, uniqueness: true

  def self.turn_on(robot_id, x:, y:, z:, direction:)
    Robot.find_or_create_by(robot_id:).turn_on(x:, y:, z:, direction:)
  end

  def self.acknowledge(robot_id)
    Robot.find_or_create_by(robot_id:).acknowledge
  end

  def self.turn_off(robot_id)
    robot = Robot.find_by(robot_id:)
    robot.turn_off

    robot.reload
  end

  def self.set_coordinates(robot_id, x:, y:, z:, direction:)
    robot = Robot.find_or_create_by(robot_id:)

    robot.set_coordinates(x:, y:, z:, direction:)

    robot.reload
  end

  def turn_on(x:, y:, z:, direction:)
    acknowledge

    set_coordinates(x:, y:, z:, direction:)

    reload
  end

  def set_coordinates(x:, y:, z:, direction:)
    self.robot_coordinate = RobotCoordinate.create(
      robot: self,
      x:,
      y:,
      z:,
      direction:
    )
  end

  def acknowledge
    self.status = "online"
  end

  def turn_off
    self.status = "offline"
  end

  def status
    robot_status.status
  end

  def coordinates
    {
      x: robot_coordinate.x,
      y: robot_coordinate.y,
      z: robot_coordinate.z
    }
  end

  def direction
    robot_coordinate.direction
  end

  private


  def status=(type)
    if robot_status&.status != type
      RobotStatus.create(robot: self, status: type)
    end
  end
end
