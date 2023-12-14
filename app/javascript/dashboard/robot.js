import { Component } from '../frontend';

class Robot extends Component {
  constructor({ robot_id: id, status, direction, coordinates }) {
    super();

    this.id = id;
    this.status = status;
    this.direction = direction;
    this.coordinates = coordinates;

    this.state('status');
    this.state('coordinates');
    this.state('direction');
  }

  body() {
    return this.html`
      <tr id="robot-${this.id}">
        <td
          id="robot-${this.id}-status"
          style="cursor:default;"
          title="Ready to receive commands"
        >
          ${this.getStatus()}
        </td>
        <td>${this.id}</td>
        <td
          id="robot-${this.id}-coordinates"
        >
          ${this.getCoordinates()}
        </td>
        <td id="robot-${this.id}-direction">
          ${this.getDirection()}
        </td>
        <td>
          <button
            class="btn btn-primary"
            id="robot-${this.id}-move-button"
            onclick=${this.move.bind(this)}
          >
            Move
          </button>
        </td>
        <td>
          <button
            class="btn btn-primary
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
    return this.element.querySelector(`#robot-${this.id}`) !== null;
  }

  getMoveButton() {
    return this.element.querySelector(`#robot-${this.id}-move-button`);
  }

  getCoordinates() {
    return `
      ${this.coordinates.x},
      ${this.coordinates.y},
      ${this.coordinates.z}
    `
  }

  getDirection() {
    return `${this.direction}`
  }
}

export default Robot;
