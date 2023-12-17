# frozen_string_literal: true

class QueryJob < WorkJob
  def before_perform
    params['next_action_method_name'] = params['method_name']
    params['method_name'] = 'make_query'
  end

  def make_query
    next_action = NextAction.create(
      robot_id:,
      class_name: params['class_name'],
      method_name: params['next_action_method_name']
    )

    ActionCable.server.broadcast(
      "robot_dashboard_#{robot_id}",
      {
        type: 'turtle_query',
        id: robot_id,
        queries: params['actions'],
        job_id: jid,
        next_action_id: next_action.id
      }
    )
  end
end
