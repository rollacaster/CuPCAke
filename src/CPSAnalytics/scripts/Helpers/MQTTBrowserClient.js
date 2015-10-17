import mqtt from 'mqtt';

/**
 * Enables to communicate via MQTT.
 * @class
 * @memberOf module:Helpers
 */
export default class MQTTBrowserClient{
  constructor(url) {
    this.client = mqtt.connect(url);
  }

  /**
   * Subscribes to a topic.
   * @function subscribe
   * @param {string} topic - The name of the topic.
   * @instance
   * @memberOf module:Helpers~MQTTBrowserClient
   */
  subscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (test) => {
        resolve();
      });
    });
  }

  /**
   * Unsubscribe of a topic.
   * @function unsubscribe
   * @param {string} topic - The name of the topic.
   * @instance
   * @memberOf module:Helpers~MQTTBrowserClient
   */
  unsubscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.unsubscribe(topic, () => {
        resolve();
      });
    });
  }

  /**
   * Receives messages.
   * @function receive
   * @param {function} callback - The listener to receive messages.
   * @instance
   * @memberOf module:Helpers~MQTTBrowserClient
   */
  receive(callback) {
    this.client.on('message', callback);
  }

  /**
   * Stops to receive messages.
   * @function stopReceive
   * @param {function} callback - The listener to receive messages.
   * @instance
   * @memberOf module:Helpers~MQTTBrowserClient
   */
  stopReceive(callback) {
    this.client.removeListener('message', callback);
  }
}
