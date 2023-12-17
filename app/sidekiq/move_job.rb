# frozen_string_literal: true

class MoveJob
  include Sidekiq::Job

  sidekiq_options retry: false

  def perform(*args)
    robot_id, direction = args

    Work.create(job_id: jid, robot_id:)

    robot = Robot.find_by(robot_id:)
    move = Move.new(robot:, direction:)

    actions = move.actions

    ActionCable.server.broadcast(
      "robot_dashboard_#{robot.robot_id}",
      {
        type: 'turtle_action',
        id: robot.robot_id,
        actions:,
        job_id: jid,
        direction:
      }
    )
  end
end
