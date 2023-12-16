class CreateMiningWorks < ActiveRecord::Migration[7.1]
  def change
    create_table :mining_works do |t|
      t.references :robot, null: false
      t.boolean :completed, null: false, default: false

      t.timestamps
    end
  end
end
