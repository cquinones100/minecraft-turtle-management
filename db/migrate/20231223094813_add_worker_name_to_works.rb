class AddWorkerNameToWorks < ActiveRecord::Migration[7.1]
  def change
    add_column :works, :worker_name, :string, null: false

    add_index :works, :worker_name
  end
end
