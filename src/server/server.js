const express = require('express');
const app = express();
const path = require('path');
const port = 3001; //different port than react
const cv = require('opencv4nodejs');

const faceClassifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

// Define an endpoint for processing facial detection
app.get('/detect', (req, res) => {
    // Get the base64-encoded image from the query parameters
    const base64Image = req.query.image;
    
    // Decode the base64 image to a buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
  
    // Read the image buffer with OpenCV
    const image = cv.imdecode(imageBuffer);
  
    // Perform facial detection
    const faces = faceClassifier.detectMultiScale(image).objects;
  
    // Return the detected faces as JSON response
    res.json({ faces });
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });