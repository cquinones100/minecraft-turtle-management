# frozen_string_literal: true

class MineJob < WorkJob
  def start_mining
    direction = 'forward'
    actions = Move.new(robot:, direction:).actions

    trigger_turtle_action(direction:, actions:, callback: 'check_next_block')
  end

  def check_next_block
    trigger_turtle_action(actions: %w[forward])
  end

  def check_fuel_level
    if params['detectDown']
      trigger_query_action(
        actions: ['getFuelLevel'],
        callback_name: 'dig'
      )
    else
      direction = 'backward'
      actions = Move.new(robot:, direction:).actions

      trigger_turtle_action(actions:)
    end
  end

  def dig
    if params['getFuelLevel'].positive?
      trigger_turtle_action(actions: %w[dig digUp suck])
    else
      trigger_query_action(actions: ['refuel'], callback_name: 'handle_refuel')
    end
  end

  def handle_refuel
    if params['response']['refuel']
      check_fuel_level
    end
  end

  def robot
    @robot ||= Robot.find(robot_id)
  end
end
