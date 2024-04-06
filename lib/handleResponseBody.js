/**
 * Masks sensitive fields in a response body.
 * @param {Object | Buffer | string} body - The body of the response to mask.
 * @returns {{payload: Object | null, error: Object | null}} The final body or an error object.
 */
const handleResponseBody = (body) => {
  let payload = null;
  let error = null;

  try {
    // Convert Buffer to string
    if (Buffer.isBuffer(body)) {
      body = body.toString('utf8');
    }
    // Parse string to JSON
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
    // Use toJSON method if available, before masking
    if (typeof body === 'object' && 'toJSON' in body) {
      body = body.toJSON();
    }
    // TODO: We can apply masking here...
    payload = body;
  } catch (e) {
    error = e;  }

  return { payload, error };
};
module.exports = handleResponseBody;
