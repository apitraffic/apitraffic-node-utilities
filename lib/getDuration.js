/**
 * Given the request start time as a process.hrtime() tuple, returns the duration of the request in milliseconds.
 * @param {[number, number]} startTime - The high-resolution real time tuple obtained from calling process.hrtime() at the start of a request.
 * @returns {number} - The request duration in milliseconds.
 */
module.exports = function getRequestDuration(startTime) {
  const NS_TO_MICRO = 1e3; // Convert nanoseconds to microseconds
  const endTime = process.hrtime(startTime); // Get the high-resolution real time difference
  const microseconds = (endTime[0] * 1e9 + endTime[1]) / NS_TO_MICRO; // Convert [seconds, nanoseconds] to microseconds
  return Math.round(microseconds / 1000);
};