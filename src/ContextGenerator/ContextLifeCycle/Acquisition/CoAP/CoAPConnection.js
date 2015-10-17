import CPSConnection from '../CPSConnection';
import log from '../../../Helper/Logger';
import coap from 'coap';

/**
 * Represents the connection via the CoAP protocol
 *
 * @class
 * @memberOf module:ContextLifeCycle/Acquisition
 * @implements {module:ContextLifeCycle/Acquisition.CPSConnection}
*/
export default class CoAPConnection extends CPSConnection {
  constructor(url) {
    super();
    this.url = url;
    this.timeout = 5 * 1000;
  }

  connect() {
    const _this = this;
    return new Promise((resolve, reject) => {
      const req = coap.request(_this.url);
      req.on('response', (res) => {
        if (res) {
          resolve(res);
        }
      });

      req.on('error', (err) => {
        err.hostname = _this.url;
        reject(err);
      });

      setTimeout(() => {
        const err = new Error(`Could not connect to ${this.url} after ${_this.timeout} seconds.`);
        err.hostname = _this.url;
        reject(err);
      }, _this.timeout);

      req.end();
    });
  }

  subscribe(endpoint) {
    const url = this.removeProtocol(this.url);
    return new Promise((resolve, reject) => {
      coap.request({
        pathname: endpoint,
        hostname: url,
        observe: true})
          .on('response', (res) => {
            log.info(`Subscribed for ${endpoint}`);
            res.on('data', data => {
              res.emit('changed', data);
              resolve(res);
            });
          }).end();
    });
  }

  removeProtocol(url) {
    const coapProtocolLenght = 7;

    if (url.indexOf('coap://') === 0) {
      return url.substring(coapProtocolLenght);
    }

    return url;
  }

  unsubscribe(endpoint) {
    throw new Error('Unsubscribe for CoAP not implement yet.');
  }
}
