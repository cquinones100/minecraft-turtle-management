class Work < ApplicationRecord
  belongs_to :robot

  def complete!
    update!(completed: true)
  end
end
