class AddCallbackToWorks < ActiveRecord::Migration[7.1]
  def change
    add_column :works, :callback, :string
  end
end
