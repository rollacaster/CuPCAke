/** @module Documentation */
import React, { PropTypes } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { Title } from '../UI';

/**
 * Shows a table with links to the documentation of the system.
 * @class
 * @augments external:Component 
*/
export default class Documentation extends React.Component {
  render() {
    const contextGeneratorDoc = `${contextGenerator}/docs/ContextGenerator`;
    const cpsAnalyticsDoc = `${contextGenerator}/docs/CPSAnalytics`;
    const restDoc = `${contextGenerator}/docs/swagger?url=${contextGenerator}/docs/swagger/contextGenerator.json`;
    return (
      <ListGroup>
          <ListGroupItem href={contextGeneratorDoc} target="_blank">
              <h5>ContextGenerator</h5>
          </ListGroupItem>
          <ListGroupItem href={cpsAnalyticsDoc} target="_blank">
              <h5>CPSAnalytics</h5>
          </ListGroupItem>
          <ListGroupItem href={restDoc} target="_blank">
              <h5>REST</h5>
          </ListGroupItem>
      </ListGroup>
    );
  }
}
