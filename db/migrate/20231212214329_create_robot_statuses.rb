# frozen_string_literal: true

class CreateRobotStatuses < ActiveRecord::Migration[7.1]
  def change
    create_table :robot_statuses do |t|
      t.references :robot, null: false

      t.integer :status, default: 0

      t.timestamps
    end
  end
end
