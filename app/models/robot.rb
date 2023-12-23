# frozen_string_literal: true

class Robot < ApplicationRecord
  has_many :robot_statuses, dependent: :destroy, inverse_of: :robot
  has_one :robot_status, -> { order(created_at: :desc) }, dependent: :destroy, inverse_of: :robot

  has_one :robot_coordinate, -> { order(created_at: :desc) }, dependent: :destroy, inverse_of: :robot
  has_many :robot_coordinates, dependent: :destroy, inverse_of: :robot

  has_one :work, -> { where(completed: false).order(created_at: :desc) }, dependent: :destroy, inverse_of: :robot
  has_many :works, dependent: :destroy, inverse_of: :robot

  validates :robot_id, presence: true, uniqueness: true

  def busy?
    work.present?
  end

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

  def x=(value)
    set_coordinates(
      x: value,
      y: robot_coordinate&.y,
      z: robot_coordinate&.z,
      direction: robot_coordinate&.direction
    )
  end

  def y=(value)
    set_coordinates(
      x: robot_coordinate&.x,
      y: value,
      z: robot_coordinate&.z,
      direction: robot_coordinate&.direction
    )
  end

  def z=(value)
    set_coordinates(
      x: robot_coordinate&.x,
      y: robot_coordinate&.y,
      z: value,
      direction: robot_coordinate&.direction
    )
  end

  def direction=(value)
    set_coordinates(
      x: robot_coordinate&.x,
      y: robot_coordinate&.y,
      z: robot_coordinate&.z,
      direction: value
    )
  end

  def acknowledge
    self.status = 'online'
  end

  def turn_off
    self.status = 'offline'
  end

  delegate :status, to: :robot_status, allow_nil: true
  delegate :x, :y, :z, to: :robot_coordinate, allow_nil: true

  def coordinates
    {
      x: robot_coordinate&.x,
      y: robot_coordinate&.y,
      z: robot_coordinate&.z
    }
  end

  delegate :direction, to: :robot_coordinate, allow_nil: true

  def start_mining
    raise 'Robot is offline' if status == 'offline'
    raise 'Robot is already mining' if mining?

    self.mining_work = MiningWork.create(robot: self)
  end

  def mining?
    false
  end

  private

  def status=(type)
    return unless robot_status&.status != type

    RobotStatus.create(robot: self, status: type)
  end
end
