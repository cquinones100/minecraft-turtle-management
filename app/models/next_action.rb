# frozen_string_literal: true

class NextAction < ApplicationRecord
  belongs_to :robot
  belongs_to :work, optional: true

  def completed?
    work.present? && work.completed?
  end

  def complete!(response = {})
    return if completed?

    work&.complete!

    response[:method_name] = method_name
    response[:robot_id] = robot.robot_id

    class_name
      .constantize
      .perform_async(response.stringify_keys)
  end
end
