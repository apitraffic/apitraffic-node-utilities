const utilities = require('./index.js')
const axios = require('axios');


const options = {
    interceptOutbound : true,
    host : "",
    token : "",
    bucket : "k1ahxzru7d6z",
    debug : false
};

// Set things up...






(async () => {
    
   
    try{

    await utilities.setup(options);

        // Await the response of the fetch call
    const response = await axios.get('https://www.boredapi.com/api/activity/')
    //console.log(response)
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error('Error fetching data:', error.message);
    }
 
     //process.exit();
 
   })(); // Call our async method immediately
 
 