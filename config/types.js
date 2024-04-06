/**
 * @typedef {Object} ApiTrafficOptions
 * @property {string} apiToken - The ApiToken to make the request.
 * @property {string} bucketSid - The bucketSid that the request will be stored in.
 * @property {boolean} sdk - The name of the sdk sending the request data.
 * @property {boolean} version - The version of the sdk sending the reques data.
 */

/**
 * @typedef {Object} ApiTrafficRequestPayload
 * @property {string} received  - 
 * @property {string} ip - 
 * @property {string} url -
 * @property {string} method - 
 * @property {object} headers - 
 * @property {string} body - 
 */

/**
 * @typedef {Object} ApiTrafficResponsePayload
 * @property {number} status - 
 * @property {string} responseTime -  
 * @property {string} body - 
 * @property {object} headers -
 * @property {number} size -
 */

/**
 * @typedef {Object} ApiTrafficPayload
 * @property {ApiTrafficRequestPayload} request - The request data.
 * @property {ApiTrafficResponsePayload} response - The response data.
 */