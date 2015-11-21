import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'react-router';
import NotificationSystem from 'react-notification-system';
import style from './styles/main.css';
import {project} from './scripts/Helpers/Constants';
import customValidationRules from './scripts/Helpers/Rules';
import NotificationActions from './scripts/UI/NotificationActions';
import NotificationStore from './scripts/UI/NotificationStore';
import CPS from './scripts/CPSConfigurator/EntityOverviewComponent';
import CPSOverview from './scripts/CPSConfigurator/CPSOverviewComponent';
import VisualizationBuilder from './scripts/VisualizationConfigurator/VisualizationBuilderComponent';
import QueryBuilder from './scripts/VisualizationConfigurator/QueryBuilderComponent';
import TimeBuilder from './scripts/VisualizationConfigurator/TimeBuilderComponent';
import Dashboard from './scripts/Dashboard';
import Documentation from './scripts/Documentation';

class App extends React.Component {
  render() {
    return (
      <div className="wrapper">
          <Header />
          <Navigation />
          <Main content={this.props.children}
                location={this.props.location}/>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div className="header">
          <ul className="navbar navbar-default navbar--nospace">
              <div className="navbar-header">
                  <Link className="navbar-brand" to="/">{project}</Link>
              </div>
          </ul>
      </div>
    );
  }
}

class Main extends React.Component {
  render() {
    const {location} = this.props;

    const isCPSBuilder = location.pathname.startsWith('/cpsBuilder');
    const isVisBuilder = location.pathname.startsWith('/visBuilder');
    const isDocs = location.pathname.startsWith('/docs');
    let title = 'Dashboard';

    if (isCPSBuilder) {
      title = 'CPS Builder';
    } else if (isVisBuilder) {
      title = 'Visualization Builder';
    } else if (isDocs) {
      title = 'Documentation';
    }

    let content = (<Dashboard />);

    if (this.props.content) {
      content = this.props.content;
    }

    return (
      <article className="main">
          <h3>{title}</h3>
          <hr/>
          {content}
          <NotificationSystem ref="notify" />
      </article>
    );
  }

  componentDidMount() {
    const {notify} = this.refs;
    NotificationActions.initiate(notify);
  }
}

class Navigation extends React.Component {
  render() {
    const documentationLink = `${contextGenerator}/docs`;

    return (
      <div className="aside">
          <nav className="navbar navbar-default">
              <ul className="nav navbar-nav navbar--column">
                  <li role="presentation"><Link to="/">Dashboard</Link></li>
                  <li role="presentation"><Link to="cpsBuilder">CPS Builder</Link></li>
                  <li role="presentation"><Link to="visBuilder/query">Visualization Builder</Link></li>
                  <li role="presentation"><Link to="docs">Documentation</Link></li>
              </ul>
          </nav>
      </div>
    );
  }
}

render((
  <Router>
      <Route path="/" component={App}>
          <Route path="cpsBuilder" component={CPSOverview} />
          <Route path="cpsBuilder/:cps" component={CPS} />
          <Route path="visBuilder/query" component={QueryBuilder} />
          <Route path="visBuilder/time/:query" component={TimeBuilder} />
          <Route path="visBuilder/vis/:query" component={VisualizationBuilder} />
          <Route path="docs" component={Documentation} />
      </Route>
  </Router>
), document.getElementById('app'));


/**
 * Notification system.
 * @external NotificationSystem
 * @see {@link https://github.com/igorprado/react-notification-system}
*/

/**
 * React Component.
 * @external Component
 * @see {@link https://facebook.github.io/react/docs/component-specs.html}
*/
