class DropRobotMias < ActiveRecord::Migration[7.1]
  def change
    drop_table :robot_mias
  end
end
