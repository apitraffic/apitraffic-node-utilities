const axios = require('axios');
const http = require('http');
const https = require('https');

// Create http and https agents with Keep-Alive enabled
const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

/**
 * Sends request data to ApiTraffic.
 * @param {ApiTrafficOptions} options
 * @param {ApiTrafficPayload} payload
 */
module.exports = async function sendToApiTraffic(options, payload) {
    try {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_TRAFFIC_TOKEN}`,
            'Api-Traffic-Bucket-Sid': options.bucketSid,
            'Api-Traffic-Sdk': options.sdk,
            'Api-Traffic-Sdk-Version': options.version
          };

        console.log(`https://${process.env.API_TRAFFIC_INGEST_HOST}`);
        console.log(payload);
        console.log(headers);
        // Fire off to the ingest endpoint to properly log the request...
        await axios.post(`https://${process.env.API_TRAFFIC_INGEST_HOST}`, payload,
            {
                headers: headers,
                httpAgent: httpAgent,
                httpsAgent: httpsAgent
            }
        );

        // Log the response...
        //console.log('Data:', response.data);
        } catch (error) {
            // Just log there was an error...
            console.error('Error:', error.response ? error.response.data : error.message);
        }
}