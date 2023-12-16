//@ts-check

import { Component } from "../frontend";

class CancelableButton extends Component {
  constructor({ robotId, action, text = null, disabled = false }) {
    super();

    this.action = action;
    this.robotId = robotId;
    this.text = text;
    this.disabled = disabled
  }

  body() {
    return this.html`
      <button
        class="btn btn-primary"
        id="robot-${this.robotId}-${this.action}-button"
        onclick=${this.onClick.bind(this)}
        disabled="${this.disabled}"
      >
        ${this.displayedAction()}
      </button>
    `
  }

  displayedAction() {
    if (this.text) {
      return this.text;
    }

    return this.action[0].toUpperCase() + this.action.slice(1);
  }

  onClick() {
    this.setState(() => {
      window.RobotChannel.perform(this.action, { id: this.robotId });

      this.disabled = true;
    });
  }

  enable() {
    this.setState(() => {
      this.disabled = false;
    });
  }
}

export default CancelableButton;
