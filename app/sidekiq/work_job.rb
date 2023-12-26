# frozen_string_literal: true

class WorkJob
  def self.perform_async(*args)
    new.perform(*args)
  end

  def initialize
    @jid = SecureRandom.uuid
  end

  def perform(*args)
    @params = args[0]

    before_perform

    send(params['method_name'])

    work.save!

    update_previous_work if params['previous_work_id']
  end

  private

  attr_accessor :params
  attr_reader :jid

  def log_work_to_console
    puts ''
    puts "doing work #{self.class.name}. params: #{params}"
    puts ''
  end

  def update_previous_work
    previous_work = Work.find(params['previous_work_id'])

    previous_work.next_work_id = work.id
    previous_work.save!
  end

  def work
    @work ||= Work.new(job_id: jid, robot_id:, worker_name: self.class.name)
  end

  alias create_work work

  def robot_id
    params['robot_id']
  end

  def before_perform; end

  def trigger_query_action(actions:, callback:)
    work.messages = "Query: #{actions.join(', ')}"
    work.complete!
    work.save!

    QueryJob.perform_async({
      robot_id:,
      actions:,
      class_name: self.class.name,
      method_name: callback
    }.stringify_keys)
  end

  def trigger_turtle_action(callback: nil, **args)
    work.messages = "Action: #{args[:actions].join(', ')}"
    work.callback = callback
    work.save!

    broadcast(type: 'turtle_action', **args)
  end

  def broadcast(type:, **args)
    ActionCable.server.broadcast(
      "robot_dashboard_#{robot.robot_id}",
      {
        type:,
        previous_work_id: work.id,
        id: robot.robot_id,
        job_id: jid
      }.merge(args)
    )
  end
end
