import { Component } from '../frontend';

class Robot extends Component {
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

  move() {
    console.log(this)
    console.log(`Moving ${this.id}`);
  }
}

export default Robot;
