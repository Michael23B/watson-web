import React, { Component } from 'react';
import './App.css';
import displayPersonality from './modules/displayPersonality';
import { Jumbotron, Button, Form, FormGroup, FormText, Label, Input, UncontrolledAlert } from 'reactstrap';

const { DisplayBigFive, DisplayNeeds, DisplayValues, DisplayConsumptionPreferences, DisplayWarnings, DisplayInputText } = displayPersonality;
//Draw error in a seperate display component so they can be reset properly
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      formText: '',
      responseError: '',
      responsePending: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  async callApi(inputText) {
    const response = await fetch('/api/personality', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({inputText: inputText})
    })

    const body = await response.json().catch(console.error);

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

  receiveApiResponse(res) {
    if (res.error) {
      this.setState({
        response: this.state.response,
        formText: this.state.formText,
        responseError: res.error,
        responsePending: ''
      });
      return;
    }
    this.setState({
      response: res,
      formText: this.state.formText,
      responseError: this.state.responseError,
      responsePending: ''
    });
  }

  handleChange(e) {
    let resultText = '';
    let fr = new FileReader();
    //If we have uploaded a file, that takes precedence.
    if (e.target.files) {
      fr.onload = (e) => { this.output = e.target.result; }
      fr.output = fr.readAsText(e.target.files[0], "UTF-8");
    }
    resultText = fr.output;

    this.setState({
      response: this.state.response,
      formText: resultText || e.target.value,
      responseError: '',
      responsePending: ''
    });
  }

  submitForm(e) {
    e.preventDefault();

    this.setState({
      response: this.state.response,
      formText: e.target.value,
      responseError: this.state.responseError,
      responsePending: 'Response pending...'
    });

    this.callApi(this.state.formText)
    .then(res => this.receiveApiResponse(res))
    .catch(console.error);
  }

  render() {
    return (
      <div>
        {!this.state.response
         ? <PersonalityLanding handleChange={this.handleChange} submitForm={this.submitForm} error={this.state.responseError} pending={this.state.responsePending}/>
         : <PersonalityResult {...this.state.response}/>}
    </div>
    );
  }
}

const PersonalityLanding = props => (
  <Jumbotron>
    <h1 className="display-3">Watson Personality</h1>
    <p className="lead">This page lets you upload text and have the Watson API infer personality insights from it.
    </p>
    <hr className="my-2" />
    {props.error
      ? <UncontrolledAlert color="danger">{props.error}</UncontrolledAlert>
      : ''
    }
    {props.pending
      ? <UncontrolledAlert color="primary">{props.pending}</UncontrolledAlert>
      : ''
    }
    <p>Upload a text file or paste text below.</p>
      <Form onSubmit={props.submitForm}>
        <FormGroup>
          <Label for="insightText">Write or paste some text</Label>
          <Input type="textarea" name="text" id="insightText" onChange={props.handleChange} placeholder="Mininum 100 words, recommended 1200." />
        </FormGroup>
        <FormGroup>
          <Label for="insightUpload">Upload a file</Label>
          <Input onChange={props.handleChange} type="file" name="file" id="insightUpload" />
          <FormText color="muted">
            Must be a .txt file. Mininum 100 words, recommended 1200.
          </FormText>
        </FormGroup>
        <Button color="primary">Submit</Button>
      </Form>
  </Jumbotron>
)

const PersonalityResult = (props) => (
<div>
  <Jumbotron style={{textAlign: 'center', padding: 5}}>
    <h1 className="display-3">Personality Insights</h1>
    <p className="lead">Results</p>
    <hr className="my-2" />
    <p style={{width:'40%', margin: 'auto'}}>
      The following is the results of a your personality test based on the supplied text.
        The percentage indicates the percentile you exhibit for that trait. For example if
        you have a 65% in a trait, you are higher than 65% of people and lower than 35%.
    </p>
  </Jumbotron>
  <div className="App-intro">
    <DisplayWarnings {...props}/>
    <DisplayInputText {...props}/>
    <DisplayBigFive {...props}/>
    <DisplayNeeds {...props}/>
    <DisplayValues {...props}/>
    <DisplayConsumptionPreferences {...props}/>
  </div>
</div>
)

export default App;
