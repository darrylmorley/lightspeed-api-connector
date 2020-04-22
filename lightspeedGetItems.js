const axios = require("axios");
const { auth, baseUrl } = require("./lightspeedConnect");
var RateLimiter = require("limiter").RateLimiter;
const fs = require("fs");

var limiter = new RateLimiter(50, "minute");
var items = [];

// Get Items
function getItems() {
  auth.then(result => {
    let token = result.access_token;

    var step = 0;

    function request() {
      limiter.removeTokens(1, () => {
        axios
          .get(`${baseUrl}/Item.json?offset=${step * 100}`, {
            headers: {
              scope: "employee:all",
              Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            items.push(res.data.Item);
            step++;
            if (step >= 53) {
              return "Done!";
            }
            return request();
          });
        fs.writeFileSync("./temp/items.json", JSON.stringify(items));
      });
    }
    return request();
  });
}

getItems();
