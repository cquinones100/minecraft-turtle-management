class RobotChannel < ApplicationCable::Channel
  def subscribed
    if params[:dashboard]
      stream_from "robot_dashboard"

      puts "Dashboard subscribed to RobotChannel"
    elsif id
      stream_from "robot_dashboard_#{params[:computer_id]}"

      puts "Robot #{id} subscribed to RobotChannel"
    end
  end

  def unsubscribed
    return unless id

    robot = Robot.turn_off(id)

    ActionCable.server.broadcast(
      "robot_dashboard",
      { type: "unsubscribed", id:, status: robot.status }
    )
  end

  def acknowledgement(data)
    coordinates = data["coordinates"]
    id = data['computer_id']

    robot = Robot.turn_on(id,
                  x: coordinates["x"],
                  y: coordinates["y"],
                  z: coordinates["z"],
                  direction: coordinates["direction"]
                 )


    ActionCable.server.broadcast(
      "robot_dashboard",
      { type: "acknowledgement", id:, status: robot.status }
    )
  end

  def move(data)
    ActionCable.server.broadcast(
      "robot_dashboard_#{data["id"]}",
      { type: "move", id: data["id"] }
    )
  end

  def move_complete(data)
    coordinates = data["coordinates"]
    id = data['computer_id']

    robot = Robot.set_coordinates(id,
                          x: coordinates["x"],
                          y: coordinates["y"],
                          z: coordinates["z"],
                          direction: coordinates["direction"]
                         )

    ActionCable.server.broadcast(
      "robot_dashboard",
      { type: "action_completed", id:, action: "move" }
    )

    ActionCable.server.broadcast(
      "robot_dashboard",
      {
        type: "coordinates_updated",
        id:,
        coordinates: robot.coordinates,
        direction: robot.direction
      }
    )
  end

  private

  def id
    params["computer_id"]
  end
end
