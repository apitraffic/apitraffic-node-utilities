const getDuration = require('./lib/getDuration');
const sendToApiTraffic = require('./lib/sendToApiTraffic');
const handleResponseBody = require('./lib/handleResponseBody');
const outboundInterception = require('./lib/outboundInterception');
const setup = require('./lib/setup');

if(!process.env.API_TRAFFIC_INGEST_HOST){
    process.env.API_TRAFFIC_INGEST_HOST = "ingest.apitraffic.io";
}
/*

if(!process.env.API_TRAFFIC_TOKEN){
    throw(`An APITraffic API Token must be set in the env variables as API_TRAFFIC_TOKEN.`);
}
if(!process.env.API_TRAFFIC_BUCKET_SID){
    throw(`An APITraffic Bucket Sid must be set in the env variables as API_TRAFFIC_BUCKET_SID.`);
}
*/
module.exports = {
    getDuration,
    sendToApiTraffic,
    handleResponseBody,
    outboundInterception,
    setup
}