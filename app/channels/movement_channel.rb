class MovementChannel < ApplicationCable::Channel
  def subscribed
    stream_from "MovementChannel"

    Robot.turn_on(id)

    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "subscribed", id: }
    )
  end

  def unsubscribed
    Robot.turn_off(id)

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

  def acknowledgement
    Robot.turn_on(id)

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
