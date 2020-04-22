// Get modules.
const axios = require("axios");
const { token, baseUrl } = require("./lightspeedConnect");
var RateLimiter = require("limiter").RateLimiter;
const fs = require("fs");

// Import data.
var sales = JSON.parse(fs.readFileSync("./temp/newSales.json"));
const bearer = JSON.parse(fs.readFileSync("./temp/bearer.json"));
var bearerToken = bearer.access_token;

// Set the api rate limiter
var limiter = new RateLimiter(5, "minute");

// Function to post sale orders.
function postSales() {
  //Create a bearer token
  token;

  // Iterate through sales data
  for (let i = 0; i < sales.length; i++) {
    // Set sale to record number in sales array
    let sale = sales[i];

    // Setup function to POST to the api
    function request() {
      // Apply limiter
      limiter.removeTokens(1, () => {
        // Post request
        axios
          .post(`${baseUrl}/Sale.json`, sale, {
            headers: {
              scope: "employee:all",
              Authorization: `Bearer ${bearerToken}`
            }
          })
          // Handle response from POST request
          .then(res => {
            // If response indicates Token Expired, get a new Token
            if (res.status == 401) {
              console.log(res.status);
              token;
            }

            if (res.status != 200) {
              console.log(res.status);
              fs.appendFileSync("./temp/errors.json", JSON.stringify(res.data));
            }

            // If we have reached the end of the data, end the function.
            if (sales[i] >= sales.length) {
              return "Done!";
            }
            console.log(res.status, i);
          })
          // Catch any errors
          .catch(err => {
            fs.appendFileSync("./temp/catch-errors.json", JSON.stringify(err));
          });
      });
    }
    // Run our request function. POST to the api.
    request();
  }
}

postSales();
