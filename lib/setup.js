
const outboundInterception = require('./outboundInterception');
module.exports = function setup(options) {

    if(!options.hasOwnProperty("interceptOutbound")){
        options.interceptOutbound = true;
    }

    // setup the outbound interception if configured to do so...
    if(options.interceptOutbound){
       outboundInterception();
    }    

    return {};
};