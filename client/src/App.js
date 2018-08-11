import React, { Component } from 'react';
import logo from './PersonalityInsights.svg';
import './App.css';
import personalityDisplay from './modules/displayPersonality';

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
        <p>The following is the results of a your personality test based on the supplied text.<br/>
          The percentage indicates the percentile you exhibit for that trait. For example if<br />
          you have a 65% in a trait, you are higher than 65% of people and lower than 35%.
          </p>
        <p className="App-intro">
          {this.state.response ? personalityDisplay.DisplayBigFive(this.state.response.personality) : 'Waiting for response...'}
          {this.state.response ? personalityDisplay.DisplayNeeds(this.state.response.needs) : ''}
          {this.state.response ? personalityDisplay.DisplayValues(this.state.response.values) : ''}
          {this.state.response ? personalityDisplay.DisplayConsumptionPreferences(this.state.response.consumption_preferences) : ''}
        </p>
      </div>
    );
  }
}

export default App;
