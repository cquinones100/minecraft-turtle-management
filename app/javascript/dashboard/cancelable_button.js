//@ts-check

import { Component } from "../frontend";

class CancelableButton extends Component {
  constructor({ robotId, action, text = null }) {
    super();

    this.action = action;
    this.robotId = robotId;
    this.text = text;
  }

  body() {
    return this.html`
      <button
        class="btn btn-primary"
        id="robot-${this.robotId}-${this.action}-button"
        onclick=${this.onClick.bind(this)}
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
    this.getButton().style.cursor = "wait";
    this.getButton().disabled = true;

    window.RobotChannel.perform(this.action, { id: this.robotId });
  }

  enable() {
    this.getButton().style.cursor = "default";
    this.getButton().disabled = false;
  }

  getButton() {
    /** @type {unknown} */
    const unknownButton = this.element;

    const button = /** @type {HTMLButtonElement} */ (unknownButton);

    return button;
  }
}

export default CancelableButton;
