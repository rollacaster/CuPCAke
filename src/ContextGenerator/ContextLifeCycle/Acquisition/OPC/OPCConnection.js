import CPSConnection from '../CPSConnection';
import log from '../../../Helper/Logger';
import opc from 'node-opcua';
import util from 'util';

/**
 * Represents the connection via the OPC UA protocol
 *
 * @class
 * @memberOf module:ContextLifeCycle/Acquisition
 * @implements {module:ContextLifeCycle/Acquisition.CPSConnection}
 */
export default class OPCConnection extends CPSConnection {
  constructor(url) {
    super();
    if (!url) {
      log.info('No url to OPCClient provided', {url: url});
    }

    this.url = url;
    this.session = null;
  }

  connect() {
    const _this = this;

    return new Promise(function(resolve, reject) {
      let client = new opc.OPCUAClient();
      client.connect(_this.url, function(err) {
        if (err) {
          err.hostname = _this.url;
          log.info({err: err}, `cannot connect to OPC-Server ${_this.url}`);
          reject(err);
        } else {
          client.createSession(function(err, session) {
            if (err) {
              log.info({err: err}, 'could not create session.');
              reject(err);
            }

            log.info('Connected to: ', {url: _this.url});
            _this.session = session;

            resolve(session);
          });
        }
      });
    });
  }

  /**
   * Browses the nodes of a OPC UA server
   * @alias browse
   * @param {string} [rootFolder=RootFolder] - The root node for the browsing.
   * @memberOf module:ContextLifeCycle/Acquisition~OPCConnection
   * @instance
   */
  browse(rootFolder = 'RootFolder') {
    let _this = this;

    const browseDescription = {
      nodeId: rootFolder
    };

    return new Promise(function(resolve, reject) {
      let session = _this.connect().then(function(session) {
        if (!session) {
          reject('No connection to a OPC Server established');
        }

        session.browse(browseDescription, function(err, nodes) {
          if (err) {
            log.info({err: err}, 'Could not browse server.');
            reject(err);
          }

          const variableOrFolderNodes = nodes[0].references.filter(
            (node) => {
              const isFolder = node.nodeClass.value === 1;
              const isVariable = node.nodeClass.value === 2;
              return isFolder || isVariable;
            });

          const filteredNodes = [];
          for (let reference of variableOrFolderNodes) {
            filteredNodes.push({
              name: reference.browseName.name,
              id: reference.nodeId,
              isFolder: reference.nodeClass.value === 1
            });
          }

          resolve(filteredNodes);
        });
      });
    });
  }

  subscribe(entity) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      if (!_this.session) {
        reject('No connection to a OPC Server established');
      }

      const subscription = new opc.ClientSubscription(_this.session, {
        publishingEnabled: true
      });

      subscription.on('error', function(err) {
        log.debug(`Subscription error for ${entity}`, {Error: err});
        reject(err, 'Subscription error.');
      });

      subscription.on('started', function() {
        log.info(`Subscribed for ${entity}`);
      }).on('terminated', function() {
        log.info(`Subscribed ended for ${entity}`);
      });

      var monitoredEntity = subscription.monitor({
        nodeId: opc.resolveNodeId(entity),
        attributeId: 13
      });

      resolve(monitoredEntity);
    });
  }

  unsubscribe(subscription) {
    return new Promise(function(resolve, reject) {
      subscription.terminate(function(err) {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}
