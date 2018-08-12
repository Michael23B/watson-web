import React, { Component } from 'react';
import logo from './img/PersonalityInsights.svg';
import './App.css';
import personalityDisplay from './modules/displayPersonality';
import { Jumbotron, Button, Form, FormGroup, FormText, Label, Input } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      formText: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  async callApi() {
    const response = await fetch('/api/personality');
    const body = await response.json().catch(console.error);

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  handleChange(e) {
    this.setState({
      response: this.state.response,
      formText: e.target.value
    })
    console.log(this.state);
  }

  submitForm(e) {
    e.preventDefault();
    console.log(e);
    this.callApi()
    .then(res => this.setState({ response: res }))
    .catch(console.error);
  }

  render() {
    return (
      <div>
        {!this.state.response
         ? <PersonalityLanding handleChange={this.handleChange} submitForm={this.submitForm}/>
         : <PersonalityResult {...this.state.response}/>}
    </div>
    );
  }
}

const PersonalityLanding = props => (
  <Jumbotron>
    <h1 className="display-3">Watson Personality</h1>
    <p className="lead">This page lets you upload text and have the Watson API infer personality insights from it.</p>
    <hr className="my-2" />
    <p>Upload a text file or paste text below.</p>
      <Form onSubmit={props.submitForm}>
        <FormGroup>
          <Label for="insightText">Write or paste some text</Label>
          <Input type="textarea" name="text" id="insightText" onChange={props.handleChange} placeholder="Mininum 100 words, recommended 1200." />
          <Button color="primary">Submit</Button>
        </FormGroup>
        <FormGroup>
          <Label for="insightUpload">Upload a file</Label>
          <Input type="file" name="file" id="insightUpload" />
          <FormText color="muted">
            Must be a .txt file. Mininum 100 words, recommended 1200.
          </FormText>
        </FormGroup>
      </Form>
  </Jumbotron>
)

const PersonalityResult = (props) => (
<div>
  <Jumbotron>
    <h1 className="display-3">Watson Personality</h1>
    <p className="lead">Personality Insights</p>
    <hr className="my-2" />
    <p>The following is the results of a your personality test based on the supplied text.<br/>
        The percentage indicates the percentile you exhibit for that trait. For example if<br />
        you have a 65% in a trait, you are higher than 65% of people and lower than 35%.
    </p>
  </Jumbotron>
    <div className="App-intro">
    {personalityDisplay.DisplayBigFive(props.personality)}
    {personalityDisplay.DisplayNeeds(props.needs)}
    {personalityDisplay.DisplayValues(props.values)}
    {personalityDisplay.DisplayConsumptionPreferences(props.consumption_preferences)}
  </div>
</div>
)

export default App;
