const axios = require("axios");
const { auth, baseUrl } = require("./lightspeedConnect");

// Get Employee Details
function getEmployees() {
  auth
    .then(result => {
      let token = result.access_token;

      axios
        .get(`${baseUrl}/Employee.json`, {
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

getEmployees();
