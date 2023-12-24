class AddNextJobToWorks < ActiveRecord::Migration[7.1]
  def change
    add_reference :works, :next_work, foreign_key: { to_table: :works }
  end
end
