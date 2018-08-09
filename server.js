const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');
const PersonalityInsights = require('watson-developer-cloud/personality-insights/v3');
const pApiInfo = require('./data/personalityApiInfo.json')

const personalityInsights = new PersonalityInsights(pApiInfo);

let personalityData = '\'Visit /api/personality\' to caluclate personality first.';

async function CallWatsonPersonality(res) {
    console.log('CallWatsonPersonality() running');
    let profileText;

    try {
        profileText = fs.readFileSync('./test-profile.txt', 'utf8');
    }
    catch(e) { console.error(e); }
    
    personalityInsights.profile(
        {
            content: profileText,
            content_type: 'text/plain',
            consumption_preferences: true
        },
        (err, response) => {
            if (err) {
                console.error(err);
                res.send(`Error occured: ${err}`)
            } else {
                personalityData = response;
                res.send(response);
                console.log('CallWatsonPersonality() finished')
            }
        }
    );
}

app.get('/api/result', (req, res) => {
    res.send(personalityData);
});

app.get('/api/personality', async (req, res) => {
    console.log('api/personality called');
    CallWatsonPersonality(res);
})

app.listen(port, () => console.log(`Listening on port ${port}`));