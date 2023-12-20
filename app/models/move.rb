# frozen_string_literal: true

class Move
  attr_reader :robot, :direction

  def initialize(robot:, direction:)
    @robot = robot
    @direction = direction
  end

  def actions
    case direction
    when 'forward'
      %w[forward]
    when 'opposite'
      %w[turnLeft turnLeft forward]
    when 'left'
      %w[turnLeft forward]
    when 'right'
      %w[turnRight forward]
    when 'up'
      %w[up]
    when 'down'
      %w[down]
    when 'backward'
      %w[back]
    end
  end

  def update_coordinates!
    return unless direction

    send("update_coordinates_#{direction}")

    robot.save!
  end

  private

  def update_coordinates_forward
    case robot.direction
    when 'north'
      robot.y += 1
    when 'south'
      robot.y -= 1
    when 'east'
      robot.x += 1
    when 'west'
      robot.x -= 1
    end
  end

  def update_coordinates_backward
    case robot.direction
    when 'north'
      robot.y -= 1
    when 'south'
      robot.y += 1
    when 'east'
      robot.x -= 1
    when 'west'
      robot.x += 1
    end
  end

  def update_coordinates_left
    case robot.direction
    when 'north'
      robot.direction = 'west'
    when 'south'
      robot.direction = 'east'
    when 'east'
      robot.direction = 'north'
    when 'west'
      robot.direction = 'south'
    end
  end

  def update_coordinates_right
    case robot.direction
    when 'north'
      robot.direction = 'east'
    when 'south'
      robot.direction = 'west'
    when 'east'
      robot.direction = 'south'
    when 'west'
      robot.direction = 'north'
    end
  end

  def update_coordinates_up
    robot.z += 1
  end

  def update_coordinates_down
    robot.z -= 1
  end
end
