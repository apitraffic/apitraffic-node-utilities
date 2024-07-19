
module.exports = class RequestManager {

    constructor() {
        this.tags = {};
        this.traces = [];
        this.requestReceivedAt = new Date().toISOString();
        this.requestStartTime = process.hrtime();
    }

    tag(key, value){
      // validate the tag data.
      if(!this.isValidData(key, 100)){
        throw new Error(`The ApiTraffic tag key must be a string that is no longer than 100 characters in length. Key: ${key}.`);
      }
      if(!this.isValidData(value, 255)){
        throw new Error(`The ApiTraffic tag value must be a string that is no longer than 255 characters in length. Value: ${value}.`);
      }

      this.tags[key] = value;
      return this;
    }

    removeTag(key){
      delete this.tags[key];
      return this;
    }

    hasTag(key){
      if(this.tags.hasOwnProperty(key)){
        return true;
      }
      return false;
    }

    getTag(key){
      if(this.tags.hasOwnProperty(key)){
        return this.tags[key];
      }
      return null;
    }

    getTagArray(){
      return  Object.keys(this.tags).length > 0
      ? Object.entries(this.tags).map(([key, value]) => ({ key, value }))
      : [];
    }

    isValidData(input, maxLength = 255) {
      return typeof input === 'string' && input.length <= maxLength;
    }

    trace(value){
      let microseconds = 0;
    
      if(!this.isValidData(value, 255)){
        throw new Error(`The ApiTraffic trace must be a string that is no longer than 255 characters in length. Value: ${value}.`);
      }
      
      // in the event that the trace happens before the request time is set...
      if(this.requestStartTime){
        const NS_TO_MICRO = 1e3; // Convert nanoseconds to microseconds
        const endTime = process.hrtime(this.requestStartTime); // Get the high-resolution real time difference
        microseconds = (endTime[0] * 1e9 + endTime[1]) / NS_TO_MICRO; // Convert [seconds, nanoseconds] to microseconds
      }      
      
      this.traces.push({time: microseconds, data: value});
    }

    getTraces(){
      return this.traces;
    }
};