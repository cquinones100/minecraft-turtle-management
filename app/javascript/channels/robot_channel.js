import consumer from "channels/consumer"

function start() {
  const channel = "RobotChannel";
  const dashboard = true;

  consumer.subscriptions.create({
    channel,
    dashboard,
  }, {
    connected() {
      console.log("Connected to RobotChannel");
    },
  
    disconnected() {
      // Called when the subscription has been terminated by the server
    },
  
    received(data) {
      // Called when there's incoming data on the websocket for this channel
    }
  });
}

export default start;
