const express = require('express');
const bodyParser = require('body-parser');
const {loadModel}  = require('/home/arjita/sentiment_analysis/sentiment-analysis.js'); // import the predict function from your AI model module
const path = require('path');
const app = express();
const port = 5000;

// parse incoming request bodies in JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route
app.get('/', function(req, res) {
  const filePath = path.resolve(__dirname, 'index.html');
  res.sendFile(filePath);
});

// handle POST requests to /predict
app.post('/predict', async(req, res) => {
  const inputText = req.body.text; // extract the text input from the request body
  const prediction = await loadModel(inputText); // call the predict function from your AI model and pass in the text input
  res.send(prediction); // send the prediction back as a JSON response
});

//start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
