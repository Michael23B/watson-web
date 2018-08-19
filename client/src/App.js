import React, { Component } from 'react';
import './App.css';
import displayPersonality from './modules/displayPersonality';
import { Jumbotron, Form, FormGroup, FormText, Label, Input, UncontrolledAlert,
          UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//TODO: change setState() calls that just change one field to be cleaner. eg newState = this.state -> newState.thingy -> setState(newState);

const { DisplayBigFive, DisplayNeeds, DisplayValues, DisplayConsumptionPreferences, DisplayWarnings, DisplayInputText } = displayPersonality;
//Draw error in a seperate display component so they can be reset properly
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      formText: '',
      formFile: '',
      responseError: '',
      responsePending: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.loadText = this.loadText.bind(this);
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
        formFile: this.state.formFile,
        responseError: res.error,
        responsePending: ''
      });
      return;
    }
    this.setState({
      response: res,
      formText: this.state.formText,
      formFile: this.state.formFile,
      responseError: this.state.responseError,
      responsePending: ''
    });
  }

  loadText(e) {
    this.setState({
      response: this.state.response,
      formText: this.state.formText,
      formFile: e.target.result,
      responseError: '',
      responsePending: ''
    });
  }

  handleChange(e) {
    //If we have uploaded a file, that takes precedence.
    if (e.target.files) {
      let fr = new FileReader();
      fr.onload = this.loadText;
      fr.output = fr.readAsText(e.target.files[0], "UTF-8");
      return;
    }

    this.setState({
      response: this.state.response,
      formText: e.target.value,
      formFile: this.state.formFile,
      responseError: '',
      responsePending: ''
    });
  }

  submitForm(e, type) {
    e.preventDefault();

    this.setState({
      response: this.state.response,
      formText: this.state.formText,
      formFile: this.state.formFile,
      responseError: this.state.responseError,
      responsePending: 'Response pending...'
    });

    this.callApi(type === 'text' ? this.state.formText : this.state.formFile)
    .then(res => this.receiveApiResponse(res))
    .catch(console.error);
  }

  render() {
    return (
      <div>
        {!this.state.response
         ? <PersonalityLanding handleChange={this.handleChange} submitForm={(e, type) => {this.submitForm(e, type)}} error={this.state.responseError} pending={this.state.responsePending}/>
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

        <UncontrolledDropdown>
          <DropdownToggle caret color="primary">
            Submit
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={e => props.submitForm(e, 'text')}>Upload text</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={e => props.submitForm(e, 'file')}>Upload file</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>

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
