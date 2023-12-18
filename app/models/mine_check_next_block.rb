class MineCheckNextBlock
  attr_reader :robot_id, :fuel_level

  def initialize(_response = {}, robot_id:)
    @robot_id = robot_id
  end

  def call
    QueryJob.perform_async(robot_id, ['detectDown'], 'Mine', 'call')
  end
end
