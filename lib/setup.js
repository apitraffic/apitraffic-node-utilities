
const outboundInterception = require('./outboundInterception');
const config = require('./config');
module.exports = function setup(options) {

    if(!options.hasOwnProperty("interceptOutbound")){
        options.interceptOutbound = true;
    }    
    if(options.hasOwnProperty("host") && options.host.length){
        config.ingestHost = options.host;
    }
    if(options.hasOwnProperty("token")){
        config.apiToken = options.token;
    }else{
        throw(`An APITraffic API Token must be set in the env variables as API_TRAFFIC_TOKEN.`);
    }
    if(options.hasOwnProperty("bucket")){
        config.bucketSid = options.bucket;
    }else{
        throw(`An APITraffic Bucket Sid must be set in the env variables as API_TRAFFIC_BUCKET_SID.`);
    }
    if(options.hasOwnProperty("debug")){
        config.debug = options.debug;
    }

    // setup the outbound interception if configured to do so...
    if(options.interceptOutbound){
       outboundInterception();
    }    

    return {};
};