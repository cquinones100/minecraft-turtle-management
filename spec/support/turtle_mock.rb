# frozen_string_literal: true

class TurtleMock
  def initialize(robot_id:, page:, x: 1, y: 1, z: 1, direction: 'north')
    @robot_id = robot_id
    @page = page
    @x = x
    @y = y
    @z = z
    @direction = direction
  end

  def acknowledge(x: nil, y: nil, z: nil, direction: nil)
    page.execute_script(
      "window.RobotChannel.perform(
        'acknowledgement',
        {
          computer_id: #{id},
          coordinates: {
            x: #{x || self.x},
            y: #{y || self.y},
            z: #{z || self.z}
            direction: '#{direction || self.direction}
          },
        }
      )"
    )
  end

  private

  attr_reader :robot_id, :page, :x, :y, :z, :direction
end
