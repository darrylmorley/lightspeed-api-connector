const axios = require("axios");
const { auth, baseUrl } = require("./lightspeedConnect");

// List all sales to the console
function getSales() {
  auth
    .then(result => {
      let token = result.access_token;

      axios
        .get(`${baseUrl}/Sale.json`, {
          headers: {
            scope: "employee:all",
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}

getSales();
