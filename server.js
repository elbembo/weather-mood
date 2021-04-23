projectData = { };

global.fetch = require("node-fetch");
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
const API_KEY = '1a926e5836bf133ebbf73b14527212c0';
const BAS_URL = 'https://api.openweathermap.org/data/2.5';
const PORT = 3000;
/* Dependencies */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// for cross origin allowance
const cors = require('cors');
app.use(cors());
/* Initializing the main project folder */

app.use(express.static('puplic'));
/**
 * route all /api/* requsts 
 * so we can protect the API key 
 * to avoid any client use my app
 * to access to my secrt key
*/
app.use('/api/', function (req, res, next) {
    if (req.method !== 'get') {
        fetch(`${BAS_URL + req.url}&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => { res.send(data) });

        return;
    }
});
/* app.get('/api/:userId', function (req, res) {
    res.send(req.url);
  }) */
//get handel
app.get('/entry', sendData)

function sendData (req, res) {
    res.send(projectData)
}
//handel post requst from cilent
app.post('/addEntry', addData)

function addData(req, res) {
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.feeling = req.body.feeling;
    res.send(projectData);
    //console.log(projectData)
}


app.listen(PORT, () => { console.log(`running on http://localhost:${PORT}`) })