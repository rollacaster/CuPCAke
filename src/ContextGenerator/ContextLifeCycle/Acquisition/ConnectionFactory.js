import MQTTConnection from './MQTT/MQTTConnection';
import OPCConnection from './OPC/OPCConnection';
import CoAPConnection from './CoAP/CoAPConnection';

/**
 * Enum for supported protocols
 * @memberOf module:ContextLifeCycle/Acquisition~ConnectionFactory
 * @enum {string}
*/
const protocol = {
  OPC: 'opc',
  MQTT: 'mqtt',
  COAP: 'coap'
};

/** Finds a protocol to connect to a CPS based on the connection URL.
 * @param {string} url - The connection URL.
 * @throws Throws an error if no suitable protocol was found.
 * @memberOf module:ContextLifeCycle/Acquisition~ConnectionFactory
 * @returns {module:ContextLifeCycle/Acquisition.CPSConnection} A suitable CPSConnection.
 */
export default function create(url) {
  if (isProtocol(protocol.OPC, url)) {
    return new OPCConnection(url);
  } else if (isProtocol(protocol.MQTT, url)) {
    return new MQTTConnection(url);
  } else if (isProtocol(protocol.COAP, url)) {
    return new CoAPConnection(url);
  } else {
    const err = new Error(`Could not find suitable protocol for ${url}`);
    err.hostname = url;
    throw err;
  }
}

function isProtocol(protocol, url) {
  return url.toLowerCase().indexOf(protocol) === 0;
}
