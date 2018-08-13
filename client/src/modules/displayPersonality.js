import React from 'react';
import {  Progress, ListGroup, ListGroupItem, UncontrolledAlert} from 'reactstrap';

//Styles
const divStyle = {
  boxShadow: '5px 10px',
  backgroundColor: '#e9ecef',
  margin: 25,
  padding: 25,
  borderStyle: "solid",
  borderWidth: 5,
  textAlign: 'center'
}

const descriptionStyle = {
  width:'50%',
  margin: 'auto'
}

const progressStyle = {
  boxShadow: '1px 2px 3px #222',
  margin: 10
}

//Functional display components based on response json from the Watson API
const DisplayWarnings = (props) => {
  let { warnings } = props;
  return(
    <div>
    {
      warnings.map(w => (
      <UncontrolledAlert color="danger">
        {w.message}
      </UncontrolledAlert>
      ))
    }
    </div>
  )
}

const DisplayInputText = (props) => {
  let { inputText, word_count } = props;
  return(
    <UncontrolledAlert color="dark">
    <h2>Input Text ({word_count} words)</h2>
    <hr className="my-2" />
    {inputText}
    </UncontrolledAlert>
  )
}

const DisplayBigFive = (props) => {
  let { personality } = props;
    return(
      <div style={divStyle}>
        <h1 className="display-4">Big 5</h1>
        <p style={descriptionStyle}>Many contemporary personality psychologists believe that there are five basic
            dimensions of personality, often referred to as the "Big 5" personality traits.
            The five broad personality traits described by the theory are
            extraversion, agreeableness, openness, conscientiousness, and neuroticism.
        </p>
      {
        personality.map(trait => {
          return(
            <div>
            <h2 className="display-5">{trait.name} ({Math.round(trait.percentile * 100)}%)</h2>
            {MapItemPercentile(trait.children)}
          </div>
          )
  
      })
    }</div>
    );
  }
  
  const DisplayNeeds = (props) => {
    let { needs } = props;
    return(
      <div style={divStyle}>
        <h1>Needs</h1>
        <p style={descriptionStyle}>This section describes the needs of the person inferred from the given text.</p>
      {MapItemPercentile(needs)}
      </div>
    );
  }
  
  const DisplayValues = (props) => {
    let { values } = props;
    return(
      <div style={divStyle}>
        <h1>Values</h1>
        <p style={descriptionStyle}>This section describes the most valued traits or ideals inferred from the text.</p>
      {MapItemPercentile(values)}
      </div>
    );
  }
  
  const DisplayConsumptionPreferences = (props) => {
    let { consumption_preferences } = props;
    return(
      <div style={divStyle}>
        <h1>Consumption preferences</h1>
        <p style={descriptionStyle}>Consumption preferences are scored 0, 50 or 100 rather a weighted percentile.</p>
      {
        consumption_preferences.map(category => {
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
  
  //Helper function to map percentages received as 0.0 - 1.0 to 0% - 100 with a progress bar beneath them.
  function MapItemPercentile(arr, childName = 'percentile') {
    return arr.map(item=> {
      let percentile = Math.round(item[childName] * 100);
      return(
        <ListGroup>
          <ListGroupItem style={progressStyle} key={item.name}>{item.name} ({percentile}%)<br/>
            <Progress value={percentile} />
          </ListGroupItem>
        </ListGroup>
      )
  })
  }

  export default {
      DisplayBigFive: DisplayBigFive,
      DisplayNeeds: DisplayNeeds,
      DisplayValues: DisplayValues,
      DisplayConsumptionPreferences: DisplayConsumptionPreferences,
      DisplayWarnings: DisplayWarnings,
      DisplayInputText: DisplayInputText
  }