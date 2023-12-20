# frozen_string_literal: true

class WorkJob
  include Sidekiq::Job

  sidekiq_options retry: false

  def perform(*args)
    @params = args[0]

    before_perform

    puts ''
    puts "doing work #{self.class.name}. params: #{params}"
    puts ''

    create_work

    send(params['method_name'])
  end

  private

  attr_accessor :params

  def work
    @work ||= Work.create(job_id: jid, robot_id:)
  end

  alias create_work work

  def robot_id
    params['robot_id']
  end

  def before_perform; end

  def trigger_chained_action(callback_name:, **args)
    ActionCable.server.broadcast(
      "robot_dashboard_#{robot_id}",
      {
        type: 'chained_action',
        id: robot_id,
        job_id: jid,
        next_action_id: next_action(callback_name).id
      }.merge(args)
    )
  end

  def trigger_query_action(actions:, callback_name:)
    QueryJob.perform_async({
      robot_id:,
      actions:,
      class_name: self.class.name,
      method_name: callback_name
    }.stringify_keys)
  end

  def next_action(method_name)
    @next_action ||= NextAction.create(
      robot_id:,
      class_name: self.class.name,
      method_name:,
      work:
    )
  end

  def trigger_turtle_action(**args)
    ActionCable.server.broadcast(
      "robot_dashboard_#{robot.robot_id}",
      {
        type: 'turtle_action',
        id: robot.robot_id,
        actions: args[:actions],
        job_id: jid
      }.merge(args)
    )
  end
end
