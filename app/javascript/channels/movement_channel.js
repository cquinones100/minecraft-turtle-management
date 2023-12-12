import consumer from "channels/consumer"

consumer.subscriptions.create("MovementChannel", {
  getContainer() {
    return document.getElementById("robots");
  },

  getRobot(id) {
    const container = this.getContainer();

    return container.querySelector(`#robot-${id}`);
  },

  addRobot(id) {
    const robot = this.getRobot(id);
    const container = this.getContainer();

    if (robot) {
      robot.remove();
    }

    const tr = 
      `<tr id="robot-${id}">
        <td>${id}</td>
        <td id="robot-${id}-status">🟢</td>
        <td>
          <button id="robot-${id}-move-button">Move</button>
        </td>
      </tr>
      `
    container.querySelector('tbody').innerHTML += tr;

    document.querySelector(`#robot-${id}-move-button`).addEventListener("click", () => {
      this.perform("move", { id })
    });
  },

  removeRobot(id) {
    const robot = this.getRobot(id);

    robot.querySelector(`#robot-${id}-status`).innerHTML = "🔴";
  },

  connected() {
    this.perform("index")
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received({ type, id }) {
    if (type) {
      if (id !== null && id !== undefined) {
        switch (type) {
          case "acknowledgement":
            this.addRobot(id);
            break;

          case "subscribed":
            this.addRobot(id);
            break;

          case "unsubscribed":
            this.removeRobot(id);
            break;
        }
      }
    }
  }
});

