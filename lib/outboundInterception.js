const http = require('http');
const https = require('https');
const helpers = require('@apitraffic/javascript-helpers');
const config = require('./config');

// Function to intercept requests
function interceptRequest(originalRequest) {
  return function(options, callback) {
    // No not intercept while sending to the ingest host...
    if(options.hostname !== config.ingestHost){
        try{
        
          let targetUrl = `${options.protocol}//`;

          if(options.auth){
            targetUrl = `${targetUrl}${options.auth}@`;
          }

          targetUrl = `${targetUrl}${options.hostname}`;

          if(options.port){
            targetUrl = `${targetUrl}:${options.port}`;
          }

          targetUrl = `${targetUrl}${options.path}`;

          const proxyOptions = {
            target: targetUrl,
            bucketSid: config.bucketSid
          };
          
          const proxyUrl = helpers.constructProxyUrl(proxyOptions);

          if(config.debug){
            console.log('===Start: ApiTraffic Outbound Interception===');
            console.log(`Original Target Url: ${proxyOptions.target}`);
            console.log(`Generated Proxy Url: ${proxyUrl.urlAsString}`);
            console.log("===End: ApiTraffic Outbound Interception===");
          }

          options.hostname = proxyUrl.url.hostname;

        }catch(e){
          console.log("The following error occured while attempting to proxy outbound request to ApiTraffic.");
          console.log(e);
        }            
    }
    // Proceed with the original request
    return originalRequest(options, callback);
  };
}

function intercept(){
    // Override the original request functions
    http.request = interceptRequest(http.request);
    https.request = interceptRequest(https.request);
    console.log("Outbound interception configured!");
}

module.exports = intercept;
