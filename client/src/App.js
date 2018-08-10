import React, { Component } from 'react';
import logo from './PersonalityInsights.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      response: ''
    }
  }

  async callApi() {
    const response = await fetch('/api/personality');
    const body = await response.json().catch(console.error);

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  componentDidMount() {
    this.callApi()
    .then(res => this.setState({ response: res }))
    .catch(console.error);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Watson Personality</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p className="App-intro">
          {this.state.response ? JSON.stringify(this.state.response, null, 4) : 'Waiting for response...'}
        </p>
      </div>
    );
  }
}

export default App;
