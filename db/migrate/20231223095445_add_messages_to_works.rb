class AddMessagesToWorks < ActiveRecord::Migration[7.1]
  def change
    add_column :works, :messages, :string, null: false
  end
end
