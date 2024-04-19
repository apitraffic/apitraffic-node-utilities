const config = require('./config');
const package = require('../package.json');
const getDuration = require('./getDuration.js');
const sendToApiTraffic = require('./sendToApiTraffic.js');
const { BatchInterceptor } = require('@mswjs/interceptors');
const { ClientRequestInterceptor } = require('@mswjs/interceptors/ClientRequest');
const { XMLHttpRequestInterceptor } = require('@mswjs/interceptors/XMLHttpRequest');

const interceptor = new BatchInterceptor({
  name: 'apitraffic-interceptor',
  interceptors: [new ClientRequestInterceptor(), new XMLHttpRequestInterceptor()],
})

const requestStore = {};

const allRequests = new Map();

async function intercept(){

    interceptor.apply();
    interceptor.on('request', handleHttpRequest);
    interceptor.on('response', handleHttpResponse);
    
    console.log("ApiTraffic: Outbound interception configured!");
}

async function handleHttpRequest({request, requestId}){
  
  // No not intercept while sending to the ingest host...
  if(request.hostname !== config.ingestHost){
    allRequests.set(requestId, request.clone());

    requestStore[requestId] = {
      start: process.hrtime(),
      receivedAt : new Date().toISOString()
    };
  }
}


async function handleHttpResponse({response, isMockedResponse, request, requestId}){

  const requestUrl = new URL(request.url);

  // No not intercept while sending to the ingest host...
  if(requestUrl.hostname !== config.ingestHost){

    const apiTrafficOptions = {
      version: package.version,
      sdk: package.name                    
    };
  
   try{

    let reader = response.body.getReader();
    const chunks = [];
    let result;

    let body;
    let size = 0;

    while (!(result = await reader.read()).done) {
      size =+ result.value.byteLength;
      chunks.push(result.value);
    }

    body = Buffer.concat(chunks).toString();

    // TODO: Account for other body types other than JSON...
    const apiTrafficPayload = {
      request: {
          received: requestStore[requestId].receivedAt,
          ip : null,
          url : request.url,
          method: request.method,
          headers : readHeaders(request.headers),
          body : request.bodyUsed ? (JSON.stringify(request.body) || null) : null
      },
      response : {
          headers : readHeaders(response.headers), 
          status : response.status,
          responseTime : getDuration(requestStore[requestId].start),
          size: size,
          body : body || null
      }
  };
  
  // we will not await the response b/c we want to fire and forget...
  sendToApiTraffic(apiTrafficOptions, apiTrafficPayload);

  }catch(e){
    console.log(e);
  }
  




  }
  
}

function readHeaders(headers) {
  const headerObj = {};
  for (const key of headers.keys()) {
    headerObj[key] = headers.get(key);
  }
  return headerObj
}
async function readStream(reader) {
  let receivedLength = 0;  // length of all chunks received
  let chunks = [];         // array to hold chunks of data

  while (true) {
      const { done, value } = await reader.read();
      if (done) {
          break;
      }
      chunks.push(value);
      receivedLength += value.length;
  }

  // Concatenate all the chunks into a single Uint8Array
  let chunksAll = new Uint8Array(receivedLength);
  let position = 0;
  for (let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
  }

  // Convert to a string if the data is textual
  const result = new TextDecoder("utf-8").decode(chunksAll);

  console.log(result);  // Output the result
}


module.exports = intercept;
