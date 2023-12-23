class DropMiningWorks < ActiveRecord::Migration[7.1]
  def change
    drop_table :mining_works
  end
end
