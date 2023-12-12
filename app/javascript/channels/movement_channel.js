import consumer from "channels/consumer"

const robots = new Set();

const thing = consumer.subscriptions.create("MovementChannel", {
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

    const newRobot = document.createElement('tr');
    newRobot.id = `robot-${id}`;

    newRobot.appendChild(document.createElement('td')).textContent = `Robot ${id}`;

    const moveButton = newRobot
      .appendChild(document.createElement('td'))
      .appendChild(document.createElement('button'));

    moveButton.id = `move-${id}`;
    moveButton.textContent = "Move";
    moveButton.addEventListener("click", () => {
      this.perform("move", { id })
    });

    container.querySelector('tbody').appendChild(newRobot);
  },

  removeRobot(id) {
    const robot = this.getRobot(id);

    robot.remove();
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

