import CPSConnection from '../CPSConnection';
import log from '../../../Helper/Logger';
import mqtt from 'mqtt';

const MAX_RECONNECTS = 5;

/**
 * Represents the connection via the MQTT protocol
 *
 * @class
 * @memberOf module:ContextLifeCycle/Acquisition
 * @implements {module:ContextLifeCycle/Acquisition.CPSConnection}
*/
export default class MQTTConnection extends CPSConnection {
  constructor(url) {
    super();
    this.client = null;
    this.url = url;
    this.reconnects = 0;
  }

  connect() {
    this.client = mqtt.connect(this.url);
    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        log.info('Connected to: ', {url: this.url});
        resolve(true);
      });

      this.client.on('reconnect', () => {
        ++this.reconnects;
        if (this.reconnects >= MAX_RECONNECTS) {
          this.client.end();
          const err = new Error('Could not connect to ${this.url} after ${this.reconnects} attempts');
          err.hostname = this.url;
          reject(err);
        }
      });

      this.client.on('error', (err) => {
        reject(err);
      });

      this.client.on('message', (topic, message) => {
        this.client.emit('changed', message, topic);
      });
    });
  }

  publish(topic, event) {
    if (!this.client) {
      this.connect().then(
        () => this.client.publish(topic, JSON.stringify(event))
      );

    }
    else {
      this.client.publish(topic, JSON.stringify(event));
    }
  }

  subscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (err, granted) => {
        if (err) reject(err);
        log.info(`Subscribed for ${granted[0].topic}`);

        resolve(this.client);
      });
    });
  }

  unsubscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.unsubscribe(topic, (err, granted) => {
        console.log('from cb', err, granted);
        if (err) reject(err);
        log.info(`Unsubscribed of ${granted[0].topic}`);

        resolve();
      });
    });
  }

  receive(callback) {
    this.client.on('message', callback);
  }
}
