# frozen_string_literal: true

class Work < ApplicationRecord
  belongs_to :robot
  has_one :next_action, dependent: :destroy, inverse_of: :work

  has_one :next_work, dependent: :destroy, inverse_of: :work, foreign_key: :next_work_id, class_name: 'Work'

  def complete!
    update!(completed: true)

    previous_work = Work.find_by(next_work_id: id)

    previous_work.complete!
  end

  def run_callback!(previous_work_id:)
    return unless callback

    worker_name
      .constantize
      .perform_async({
        robot_id:,
        method_name: callback,
        previous_work_id:
      }.stringify_keys)
  end
end
