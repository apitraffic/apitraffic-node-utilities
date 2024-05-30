const config = require('./config');
const package = require('../package.json');
const getDuration = require('./getDuration.js');
const sendToApiTraffic = require('./sendToApiTraffic.js');
const { BatchInterceptor } = require('@mswjs/interceptors');
const { ClientRequestInterceptor } = require('@mswjs/interceptors/ClientRequest');
const { XMLHttpRequestInterceptor } = require('@mswjs/interceptors/XMLHttpRequest');
const { createGunzip } = require('zlib');

const interceptor = new BatchInterceptor({
  name: 'apitraffic-interceptor',
  interceptors: [new ClientRequestInterceptor(), new XMLHttpRequestInterceptor()],
})

const requestStore = {};

const allRequests = new Map();

async function intercept(){

    // only allow intercept in node 18 and above...
    if(isVersionGreaterOrEqual("18.0.0")){
      interceptor.apply();
      interceptor.on('request', handleHttpRequest);
      interceptor.on('response', handleHttpResponse);
      
      console.log("ApiTraffic: Outbound interception configured!");
    }else{
      console.log("ApiTraffic: Cannot configure Outbound interception in Node versions less than 18.");
    }    
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

    body = Buffer.concat(chunks);

    // Check if the content is gzipped, if so we need to properly handle...
    const contentEncoding = response.headers.get('content-encoding');
    if (contentEncoding === 'gzip') {
      body = await gunzip(body);
    }

    body = body.toString(getCharsetFromContentType(response.headers.get('content-type')));

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

function gunzip (buffer) {
  return new Promise((resolve, reject) => {
  const gunzipStream = createGunzip();
  const chunks = [];

  gunzipStream.on('data', (chunk) => chunks.push(chunk));
  gunzipStream.on('end', () => resolve(Buffer.concat(chunks)));
  gunzipStream.on('error', reject);

  gunzipStream.end(buffer);
  });
}
// Function to detect common encodings
function detectEncoding (str) {
  // Example heuristic: check if it's valid base64 or hex
  try {
    Buffer.from(str, 'base64');
    return 'base64';
  } catch (e) {
    try {
      Buffer.from(str, 'hex');
      return 'hex';
    } catch (e) {
      return 'utf-8'; // Default fallback
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

function getCharsetFromContentType(contentType) {
  if(contentType){
    const charsetMatch = contentType.match(/charset=([^;]*)/);
    return charsetMatch ? charsetMatch[1] : 'utf-8'; // Default to 'utf-8' if no charset is found
  }else{
    return 'utf-8';
  }  
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

function isVersionGreaterOrEqual(requiredVersion) {
  const [reqMajor, reqMinor] = requiredVersion.split('.').map(Number);
  const [currentMajor, currentMinor, currentPatch] = process.version.slice(1).split('.').map(Number);

  if (currentMajor > reqMajor) return true;
  if (currentMajor === reqMajor && currentMinor >= reqMinor) return true;
  return false;
}


module.exports = intercept;
