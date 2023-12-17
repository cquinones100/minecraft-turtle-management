class CreateWorks < ActiveRecord::Migration[7.1]
  def change
    create_table :works do |t|
      t.references :robot, null: false
      t.string :job_id
      t.boolean :completed, null: false, default: false

      t.timestamps
    end

    add_index :works, :job_id, unique: true
  end
end
