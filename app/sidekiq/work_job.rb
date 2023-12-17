class WorkJob
  include Sidekiq::Job

  def perform(*args)
    robot_id, action = args
  end
end
