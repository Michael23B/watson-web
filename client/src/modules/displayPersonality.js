import React from 'react';

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

  export default {
      DisplayBigFive: DisplayBigFive,
      DisplayNeeds: DisplayNeeds,
      DisplayValues: DisplayValues,
      DisplayConsumptionPreferences: DisplayConsumptionPreferences
  }