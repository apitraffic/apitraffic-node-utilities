const getDuration = require('./lib/getDuration');
const sendToApiTraffic = require('./lib/sendToApiTraffic');
const handleResponseBody = require('./lib/handleResponseBody');
const outboundInterception = require('./lib/outboundInterception');
const setup = require('./lib/setup');
const config = require('./lib/config');
const RequestManager = require('./lib/RequestManager');

module.exports = {
    getDuration,
    sendToApiTraffic,
    handleResponseBody,
    outboundInterception,
    setup,
    config,
    RequestManager
}