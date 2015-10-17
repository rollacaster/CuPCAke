import React from 'react';
import {get} from '../Helpers/AjaxHelper';
import {FormInput} from '../UI/Forms/FormElements';
import {Button} from '../UI';
import cx from 'classnames';

/**
 * Creates a tree structure that allows to browse through the nodes
 * of a OPC server. Allows to click on nodes which can be subscribed.
 * @class
 * @augments external:Component
 * @alias OPCBrowser
 * @memberOf module:CPSConfigurator
 * @param {string} connection - Active connection.
 * @param {string} cps - Active CPS.
 */
export default React.createClass({
  propTypes: {
    connection: React.PropTypes.string,
    cps: React.PropTypes.string
  },

  mixins: [Formsy.Mixin],

  getInitialState: function() {
    return {nodes: this.props.initialNodes};
  },

  handleLeafClick: function (e) {
    this.setValue(e.target.id);
  },

  onNodeSelect: function(selectedNode, isNodeOpen) {
    if (isNodeOpen) {
      //Close and remove node
      this.updateNodes(this.state.nodes, selectedNode);
      this.setState({nodes: this.state.nodes});
    } else {
      const {cps, connection} = this.props;

      //Open and add node
      get(`cps/${cps}/browse?connection=${connection}&rootFolder=${selectedNode}`).then(
        (loadedChildren) => {
          this.updateNodes(this.state.nodes, selectedNode, loadedChildren);
          this.setState({nodes: this.state.nodes});
        }
      );
    }
  },

  updateNodes: function(allNodes, nodeToFind, loadedChildren) {
    allNodes.map(
      (node) => {
        if (node.id === nodeToFind) {
          if (loadedChildren) {
            node.nodes = loadedChildren;
          }
          else {
            node.nodes = null;
          }

          return allNodes;
        }
        else if (node.nodes) {
          this.updateNodes(node.nodes, nodeToFind, loadedChildren);
        }
      }
    );
  },

  renderBranches: function(nodes) {
    return nodes.map((node) => {
      if (node.isFolder && node.nodes) {
        return (<Branch name={node.name} id={node.id} key={node.id}
                        handleBranchClick={this.onNodeSelect}
                        open>
    {this.renderBranches(node.nodes)}
        </Branch>)
      }

      if(!node.isFolder) {
        let text = 'Subscribe';
        const isSelectedLeaf = this.getValue() === node.id;
        if (isSelectedLeaf) {
          text = 'Choosed';
        }

        return (<Leaf text={text} name={node.name} key={node.id}
                      onLeafClick={this.handleLeafClick} id={node.id}
                      selected={isSelectedLeaf} />)
      } else {
        return (<Branch name={node.name} id={node.id} key={node.id}
                        handleBranchClick={this.onNodeSelect}/>);
      }
    });
  },

  render: function() {
    const className =  this.showRequired() ? 'has-warning' :
                       this.showError() ? 'has-error' : null;

    return (
      <div className={className}>
          <label className="control-label" htmlFor="radio">
              <span>Subscribe to</span>
          </label>
          {this.renderBranches(this.state.nodes)}
      </div>
    );
  },
});

class Branch extends React.Component {
  onBranchClick(e) {
    this.props.handleBranchClick(e.target.id, this.props.open);
  }

  render() {
    const classes = cx(
      'glyphicon',
      {
        'glyphicon-plus': !this.props.open,
        'glyphicon-minus': this.props.open,
      }
    );

    return (
      <ul className="branch">
          <li>
              <span id={this.props.id} className={classes}
                    onClick={this.onBranchClick.bind(this)}>
                  {this.props.name}
              </span>
              {this.props.children}
          </li>
      </ul>
    );
  }
}

class Leaf extends React.Component {
  render() {
    return (
      <a className="list-group-item  branch__leaf">{this.props.name}
          { this.props.selected ?
           (<Button text={this.props.text} id={this.props.id}
             xs success/>) :
           (<Button text={this.props.text} id={this.props.id}
             onClick={this.props.onLeafClick} xs primary />)
           }
      </a>
    );
  }
}
