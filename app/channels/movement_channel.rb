class MovementChannel < ApplicationCable::Channel
  def subscribed
    stream_from "MovementChannel"

    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "subscribed", id: }
    )
  end

  def unsubscribed
    if id
      Robot.turn_off(id)
    end

    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "unsubscribed", id: }
    )
  end

  def index
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "roll_call" }
    )
  end

  def acknowledgement(data)
    coordinates = data["coordinates"]
    id = data['computer_id']

    Robot.turn_on(id,
                  x: coordinates["x"],
                  y: coordinates["y"],
                  z: coordinates["z"],
                  direction: coordinates["direction"]
                 )


    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "acknowledgement", id: }
    )
  end

  def move
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "move" }
    )
  end

  def say_hello
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "say_hello", id: }
    )
  end

  def say_hello_complete
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "action_completed", id:, action: "hello" }
    )
  end

  private

  def id
    params["computer_id"]
  end
end
