class NextAction < ApplicationRecord
  belongs_to :robot

  def complete!(response = {})
    class_name
      .constantize
      .new(response, robot_id: robot.robot_id)
      .send(method_name)
  end
end
