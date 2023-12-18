class MineJob
  include Sidekiq::Job

  sidekiq_options retry: false

  def perform(*args)
    robot_id = args

    Work.create(job_id: jid, robot_id:)

    actions = Move.new(robot:, direction: 'forward').actions

    next_action = NextAction.create(
      robot_id:,
      class_name: 'MineCheckNextBlock',
      method_name: 'call'
    )

    ActionCable.server.broadcast(
      "robot_dashboard_#{robot.robot_id}",
      {
        type: 'chained_action',
        id: robot.robot_id,
        actions:,
        job_id: jid,
        direction:,
        next_action_id: next_action.id
      }
    )
  end
end
