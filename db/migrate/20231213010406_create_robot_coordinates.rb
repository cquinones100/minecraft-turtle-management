class CreateRobotCoordinates < ActiveRecord::Migration[7.1]
  def change
    create_table :robot_coordinates do |t|
      t.references :robot, null: false
      t.integer :x, null: false
      t.integer :y, null: false
      t.integer :z, null: false
      t.integer :direction, null: false

      t.timestamps
    end

    add_index :robot_coordinates, :x
    add_index :robot_coordinates, :y
    add_index :robot_coordinates, :z
  end
end
