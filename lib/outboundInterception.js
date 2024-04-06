const http = require('http');
const https = require('https');

// Function to intercept requests
function interceptRequest(originalRequest) {
  return function(options, callback) {
    // No not intercept while sending to the ingest host...
    if(options.hostname !== process.env.API_TRAFFIC_INGEST_HOST){
        console.log(`Making request to ${options.hostname}${options.path}`);
    }
    // Proceed with the original request
    return originalRequest(options, callback);
  };
}

function intercept(){
    // Override the original request functions
    http.request = interceptRequest(http.request);
    https.request = interceptRequest(https.request);
    console.log("Interception configured!");
}

module.exports = intercept;
