# frozen_string_literal: true

class Mia < ActiveRecord::Migration[7.1]
  def change
    create_table :robot_mias do |t|
      t.references :robot, null: false

      t.boolean :active, null: false, default: true
    end
  end
end
