class QueryJob
  include Sidekiq::Job

  sidekiq_options retry: false

  def perform(*args)
    robot_id, queries, class_name, method_name = args

    Work.create(job_id: jid, robot_id:)
    next_action = NextAction.create(
      robot_id:,
      class_name:,
      method_name:
    )

    ActionCable.server.broadcast(
      "robot_dashboard_#{robot_id}",
      {
        type: 'turtle_query',
        id: robot_id,
        queries:,
        job_id: jid,
        next_action_id: next_action.id
      }
    )
  end
end
