import { Component } from '../frontend';

class Robot extends Component {
  static find(id) {
    return new Robot({ robot_id: id });
  }

  constructor({ robot_id: id, status }) {
    super();

    this.id = id;
    this.status = status;
  }

  body() {
    return this.html`
      <tr id="robot-${this.id}">
        <td>${this.id}</td>
        <td
          id="robot-${this.id}-status"
          style="cursor:default;"
          title="Ready to receive commands"
        >
          ${this.getStatus()}
        </td>
        <td>
          <button
            id="robot-${this.id}-move-button"
            onclick=${this.move.bind(this)}
          >
            Move
          </button>
        </td>
        <td>
          <button
            id="robot-${this.id}-say_hello-button"
          >
            Say Hello
          </button>
        </td>
      </tr>
    `;
  }

  getStatus() {
    if (this.status == "online") {
      return "🟢";
    } else {
      return "🔴";
    }
  }

  setStatus(status) {
    this.status = status;

    document.querySelector(`#robot-${this.id}-status`).innerHTML = this.getStatus();
  }

  move() {
    console.log(this)
    console.log(`Moving ${this.id}`);

    const moveButton = this.getMoveButton();
    moveButton.style.cursor = "wait";
    moveButton.disabled = true;

    RobotChannel.perform("move", { id: this.id });
  }

  moveCompleted() {
    const moveButton = this.getMoveButton();

    moveButton.style.cursor = "default";
    moveButton.disabled = false;
  }

  isMounted() {
    return document.querySelector(`#robot-${this.id}`) !== null;
  }

  getMoveButton() {
    return document.querySelector(`#robot-${this.id}-move-button`);
  }
}

export default Robot;
