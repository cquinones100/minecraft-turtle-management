class NextAction < ApplicationRecord
  belongs_to :robot

  def complete!(response = {})
    response[:method_name] = method_name
    response[:robot_id] = robot.robot_id

    class_name
      .constantize
      .perform_async(response.stringify_keys)
  end
end
