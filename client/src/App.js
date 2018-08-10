import React, { Component } from 'react';
import logo from './PersonalityInsights.svg';
import './App.css';
//import helper from './helper';

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
        <em>The following is the results of a your personality test based on the supplied text.<br/>
          The percentage indicates the percentile you exhibit for that trait. For example if<br />
          you have a 65% in a trait, you are higher than 65% of people and lower than 35%.
          </em>
        <p className="App-intro">
          {this.state.response ? BigFivePersonality(this.state.response.personality) : 'Waiting for response...'}
        </p>
      </div>
    );
  }
}

const BigFivePersonality = (props) => {
  return(
    <div>
    {
      props.map(trait => {
        return(
          <div>
          <h1>{trait.name} ({Math.round(trait.percentile * 100)}%)</h1>
          <ul>
          {
            trait.children.map(t => {
              return(
                <li>{t.name} ({Math.round(t.percentile * 100)}%)</li>
              )
          })
        }
        </ul>
        </div>
        )

    })
  }</div>
  );
}

export default App;
