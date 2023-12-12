class MovementChannel < ApplicationCable::Channel
  def subscribed
    stream_from "MovementChannel"

    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "subscribed", id: params["computer_id"] }
    )
  end

  def unsubscribed
    puts "unsubscribed"

    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "unsubscribed", id: params["computer_id"] }
    )
  end

  def index
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "roll_call" }
    )
  end

  def acknowledgement(data)
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "acknowledgement", id: params["computer_id"] }
    )
  end

  def move
    ActionCable.server.broadcast(
      "MovementChannel",
      { type: "move" }
    )
  end
end
