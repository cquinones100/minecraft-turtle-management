import consumer from "channels/consumer"

function start() {
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
        <td
      id="robot-${id}-status"
      style="cursor:default;"
      title="Ready to receive commands"
        >
        🟢
        </td>
        <td>
        <button
      id="robot-${id}-move-button"
        >
        Move
        </button>
        </td>
        <td>
        <button
      id="robot-${id}-say_hello-button"
        >
        Say Hello
        </button>
        </td>
        </tr>
        `
      container.querySelector('tbody').innerHTML += tr;

      document.querySelector(`#robot-${id}-move-button`).addEventListener("click", () => {
        this.startAction(id, "move");
      });

      document.querySelector(`#robot-${id}-say_hello-button`).addEventListener("click", (e) => {
        this.startAction(id, "say_hello");
      });
    },

    startAction(id, action) {
      const button = document.querySelector(`#robot-${id}-${action}-button`);

      button.disabled = true;
      button.style.cursor = "wait";

      this.perform(action, { id })
    },

    completeAction(id, action) {
      const button = document.querySelector(`#robot-${id}-${action}-button`);

      button.disabled = false;
      button.style.cursor = "default";
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

    received({ type, id, ...rest }) {
      console.log(`type: ${type}, id: ${id}`);

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

            case "action_completed":
              const { action } = rest;

              this.completeAction(id, action);

              break;

            case "coordinates_updated":
              const { coordinates, direction } = rest;
              const { x, y, z } = coordinates;

              console.log(`coordinates: { x: ${x}, y: ${y}, z: ${z} }, direction: ${direction}`);

              break;
          }
        }
      }
    }
  });
}

export default start;

