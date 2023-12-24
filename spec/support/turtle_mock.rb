# frozen_string_literal: true

class TurtleMock
  delegate :page, to: :context

  def initialize(robot_id:, context:, x: 1, y: 1, z: 1, direction: 'north')
    @robot_id = robot_id
    @x = x
    @y = y
    @z = z
    @direction = direction
    @context = context
    @turtle_action_data = nil

    mock_action_cable
  end

  def acknowledge(x: nil, y: nil, z: nil, direction: nil)
    broadcast('acknowledgement',
              coordinates: {
                x: x || self.x,
                y: y || self.y,
                z: z || self.z,
                direction: direction || self.direction
              })
  end

  def stop_mining(retries: 0)
    if !turtle_action_data && retries < 5
      sleep 0.5

      stop_mining(retries: retries + 1)
    elsif !turtle_action_data && retries >= 5
      raise 'No turtle data, is there an actioncable error?'
    else
      broadcast(
        'action_done', {
          job_id: turtle_action_data[:job_id],
          original_message: turtle_action_data
        }
      )
    end
  end

  private

  attr_reader :robot_id, :x, :y, :z, :direction, :context

  attr_accessor :turtle_action_data

  # rubocop:disable Metrics/AbcSize
  def mock_action_cable
    context.allow(ActionCable.server)
           .to context.receive(:broadcast)
                      .with(
                        'robot_dashboard',
                        context.anything
                      ).and_call_original

    context
      .allow(ActionCable.server)
      .to context.receive(:broadcast)
                 .with(
                   "robot_dashboard_#{robot_id}",
                   context.anything
                 ) do |_stream, data|
      case data[:type]
      when 'turtle_action'
        self.turtle_action_data = data
      end
    end
  end
  # rubocop:enable Metrics/AbcSize

  def broadcast(type, data)
    connection = wait_for_connection

    RobotChannel
      .new(connection, 'dashboard')
      .send(type, deep_stringify_keys(data.merge(computer_id: robot_id, type:, action: type)))
  end

  def wait_for_connection
    connections = ActionCable.server.connections

    connection = connections.first { |c| c.robot_id == 'dashboard' }

    return connection if connection

    sleep 0.5

    wait_for_connection
  end

  def deep_stringify_keys(data)
    if data.is_a?(Hash)
      data.each_with_object({}) do |(k, v), h|
        h[k.to_s] = deep_stringify_keys(v)
      end
    elsif data.is_a?(Array)
      data.map { |v| deep_stringify_keys(v) }
    else
      data
    end
  end
end
