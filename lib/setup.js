
const outboundInterception = require('./outboundInterception');
const config = require('./config');
module.exports = async function setup(options) {
    
    if(options.hasOwnProperty("interceptOutbound")){
        options.interceptOutbound = options.interceptOutbound;
    }else if(process.env.hasOwnProperty("API_TRAFFIC_INTERCEPT_OUTBOUND")){
        options.interceptOutbound = process.env.API_TRAFFIC_INTERCEPT_OUTBOUND;
    }else{
        options.interceptOutbound = true;
    }

    if(options.hasOwnProperty("host") && options.host.length){
        config.ingestHost = options.host;
    }else if(process.env.hasOwnProperty("API_TRAFFIC_HOST") && process.env.API_TRAFFIC_HOST.length){
        config.ingestHost = process.env.API_TRAFFIC_HOST;
    }

    if(options.hasOwnProperty("token") && options.token.length){
        config.apiToken = options.token;
    }else if(process.env.hasOwnProperty("API_TRAFFIC_TOKEN") && process.env.API_TRAFFIC_TOKEN.length){
        config.apiToken = process.env.API_TRAFFIC_TOKEN;
    }else{
        throw new Error(`An APITraffic API Token must be set in the env variables as API_TRAFFIC_TOKEN.`);
    }

    if(options.hasOwnProperty("bucket") && options.bucket.length){
        config.bucketSid = options.bucket;
    }else if(process.env.hasOwnProperty("API_TRAFFIC_BUCKET") && process.env.API_TRAFFIC_BUCKET.length){
        config.bucketSid = process.env.API_TRAFFIC_BUCKET;
    }else{
        throw new Error(`An APITraffic Bucket Sid must be set in the env variables as API_TRAFFIC_BUCKET_SID.`);
    }

    if(options.hasOwnProperty("debug")){
        config.debug = options.debug || false;
    }else if(process.env.hasOwnProperty("API_TRAFFIC_DEBUG")){
        config.debug = process.env.API_TRAFFIC_DEBUG || false;
    }else{
        config.debug =  false;
    }

    // setup the outbound interception if configured to do so...
    if(options.interceptOutbound){
       await outboundInterception();
    }    

    return {};
};