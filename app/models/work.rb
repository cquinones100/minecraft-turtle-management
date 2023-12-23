# frozen_string_literal: true

class Work < ApplicationRecord
  belongs_to :robot
  has_one :next_action, dependent: :destroy, inverse_of: :work

  def complete!
    update!(completed: true)
  end
end
