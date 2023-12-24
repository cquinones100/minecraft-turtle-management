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

  private

  attr_reader :robot_id, :x, :y, :z, :direction, :context

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
        broadcast(
          'action_done', {
            type: data[:type],
            job_id: data[:job_id],
            original_message: data.except(:type)
          }
        )
      end
    end
  end
  # rubocop:enable Metrics/AbcSize

  def broadcast(type, data)
    json_data = data.merge(computer_id: robot_id).to_json

    page.execute_script(
      "window.RobotChannel.perform(
        '#{type}',
        JSON.parse('#{json_data}'),
      )"
    )
  end
end
