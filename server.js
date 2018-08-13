const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3');
const pApiInfo = require('./data/personalityApiInfo.json')

const personalityInsights = new PersonalityInsights(pApiInfo);

let personalityData = '\'Visit /api/personality\' to caluclate personality first.';

async function CallWatsonPersonality(inputText, res) {
    personalityInsights.profile(
        {
            content: inputText,
            content_type: 'text/plain',
            consumption_preferences: true
        },
        (err, response) => {
            if (err) {
                console.error(err);
                res.status(400).send({error: err})
            } else {
                personalityData = response;
                personalityData.inputText = inputText;
                res.send(personalityData);
            }
        }
    );
}

function SendTestResult(res) {
    //For testing purposes just use this earlier result
    let testResult = require('./data/test-personality.json')
    let inputText;
    try {
        inputText = fs.readFileSync('./data/test-profile.txt', 'utf8');
    }
    catch(e) { console.error(e); }
    testResult.inputText = inputText;
    res.send(testResult);
}

app.use(express.json());

app.get('/api/result', (req, res) => {
    res.send(personalityData);
});

app.post('/api/personality', async (req, res) => {
    let { inputText } = req.body;
    if (!inputText || inputText.length < 100) {
        res.send({'error': 'Input text is not long enough! Minimum 100 words.'});
        return;
    }

    CallWatsonPersonality(inputText, res);
    //SendTestResult(res);
})

app.listen(port, () => console.log(`Listening on port ${port}`));