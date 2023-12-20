class AddWorkIdToNextAction < ActiveRecord::Migration[7.1]
  def change
    add_reference :next_actions, :work, null: true
  end
end
