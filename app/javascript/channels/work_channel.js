import consumer from "channels/consumer"

/**
  * @param {import("../dashboard/work_table").default} workProps
  * @param {HTMLElement} [container]
  */
function start(workTable, container) {
  let mounted = false;

  consumer.subscriptions.create("WorkChannel", {
    connected() {
      if (!mounted) {
        workTable.mount(container);
        mounted = true;
      }
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
