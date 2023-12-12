class CreateRobots < ActiveRecord::Migration[7.1]
  def change
    create_table :robots, id: false do |t|
      t.integer :robot_id, null: false, primary_key: true

      t.timestamps
    end

    add_index :robots, :robot_id, unique: true
  end
end
