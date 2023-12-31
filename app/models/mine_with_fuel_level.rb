class MineWithFuelLevel
  attr_reader :robot_id, :fuel_level

  def initialize(response, robot_id:)
    @robot_id = robot_id
    @fuel_level = response['getFuelLevel']
  end

  def call
    MineJob.perform_async(robot_id) if fuel_level.positive?
  end
end

