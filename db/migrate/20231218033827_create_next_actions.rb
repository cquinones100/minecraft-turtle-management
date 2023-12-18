class CreateNextActions < ActiveRecord::Migration[7.1]
  def change
    create_table :next_actions do |t|
      t.references :robot, null: false
      t.string :class_name, null: false
      t.string :method_name, null: false

      t.timestamps
    end
  end
end
