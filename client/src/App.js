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
        <p>The following is the results of a your personality test based on the supplied text.<br/>
          The percentage indicates the percentile you exhibit for that trait. For example if<br />
          you have a 65% in a trait, you are higher than 65% of people and lower than 35%.
          </p>
        <p className="App-intro">
          {this.state.response ? DisplayBigFive(this.state.response.personality) : 'Waiting for response...'}
          {this.state.response ? DisplayNeeds(this.state.response.needs) : ''}
          {this.state.response ? DisplayValues(this.state.response.values) : ''}
          {this.state.response ? DisplayConsumptionPreferences(this.state.response.consumption_preferences) : ''}
        </p>
      </div>
    );
  }
}

const DisplayBigFive = (personality) => {
  return(
    <div>
      <h1>Big 5</h1>
      <p>Many contemporary personality psychologists believe that there are five basic<br />
          dimensions of personality, often referred to as the "Big 5" personality traits.<br/>
          The five broad personality traits described by the theory are<br/>
          extraversion, agreeableness, openness, conscientiousness, and neuroticism.
      </p>
    {
      personality.map(trait => {
        return(
          <div>
          <h2>{trait.name} ({Math.round(trait.percentile * 100)}%)</h2>
          {MapItemPercentile(trait.children)}
        </div>
        )

    })
  }</div>
  );
}

const DisplayNeeds = (needs) => {
  return(
    <div>
      <h1>Needs</h1>
      <p>This section describes the needs of the person inferred from the given text.
      </p>
    {MapItemPercentile(needs)}
    </div>
  );
}

const DisplayValues = (values) => {
  return(
    <div>
      <h1>Values</h1>
      <p>This section describes the most valued traits or ideals inferred from the text.
      </p>
    {MapItemPercentile(values)}
    </div>
  );
}

const DisplayConsumptionPreferences = (preferences) => {
  return(
    <div>
      <h1>Consumption preferences</h1>
      <p>Consumption preferences are scored 0, 50 or 100 rather than weighted as a percentile.</p>
    {
      preferences.map(category => {
        return(
          <div>
          <h2>{category.name}</h2>
          {MapItemPercentile(category.consumption_preferences, 'score')}
        </div>
        )

    })
  }</div>
  );
}

function MapItemPercentile(arr, childName = 'percentile') {
  return arr.map(item => {
    return(
      <ul>
      <li>{item.name} ({Math.round(item[childName] * 100)}%)</li>
    </ul>
    )
})
}

export default App;
