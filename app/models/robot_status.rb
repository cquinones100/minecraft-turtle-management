# frozen_string_literal: true

class RobotStatus < ApplicationRecord
  belongs_to :robot

  enum status: { offline: 0, online: 1, error: 2 }
end
