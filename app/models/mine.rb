class Mine
  attr_reader :robot_id, :fuel_level

  def initialize(response, robot_id:)
    @robot_id = robot_id
    @fuel_level = response['detectDown']
  end

  def call
    if detect_down == true
      DigJob.perform_async(robot_id)
    else
      MoveJob.perform_async(robot_id, 'backward')
    end
  end

  private

  def dig
    ActionCable.server.broadcast(
      "robot_dashboard_#{robot.robot_id}",
      {
        type: 'turtle_action',
        id: robot.robot_id,
        actions: %w[dig digUp suck],
        job_id: jid,
        direction:
      }
    )
  end
end
