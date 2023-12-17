//@ts-check

import { Component } from "../frontend";

class CancelableButton extends Component {
  constructor({ robotId, action, text = null, disabled = false, onClick }) {
    super();

    this.action = action;
    this.robotId = robotId;
    this.text = text;
    this.disabled = disabled
    this.onClick = onClick;
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

  enable() {
    this.setState(() => {
      this.disabled = false;
    });
  }
}

export default CancelableButton;
