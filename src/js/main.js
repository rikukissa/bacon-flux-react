'use strict';

import React from 'react';

import {
  refresh,
  loading,
  repository
} from './actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null
    };
  }
  componentDidMount() {
    repository.onValue((value) =>
      this.setState({repository: value}));
    loading.onValue((value) =>
      this.setState({loading: value}));
  }
  refresh() {
    refresh.push();
  }
  render() {
    const {repository, loading} = this.state;

    if(!repository) {
      return <span>Loading...</span>;
    }

    const commitItems = repository.commits.map((item, i) => {
      const {commit} = item;
      return (
        <li key={i}>
          <span>
            {commit.message.replace(/\n/g, '<br />')}
          </span>
          <br /><br />
          <small>{commit.committer.name}</small>
        </li>
      );
    });

    return (
      <div>
        <h1>{repository.description}</h1>
        <div className="header">
          <h2>
            <a href={repository.html_url}>
              {repository.full_name}
            </a>
          </h2>
          <button onClick={this.refresh}>Refresh {loading ? 'Loading' : ''}</button>
        </div>
        <ul>{commitItems}</ul>
      </div>
    );
  }
}

React.render(<App />, document.body);
