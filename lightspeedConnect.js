const axios = require("axios");
const oauth = require("axios-oauth-client");
const fs = require("fs");

// Get refresh token if required.
const getRefreshToken = oauth.client(axios.create(), {
  url: "https://cloud.lightspeedapp.com/oauth/access_token.php",
  grant_type: "refresh_token",
  client_id: "2da57bd760d48d0f24723007ea5b815ce486d80d78de53e31f02b5e097664cbf",
  client_secret:
    "4c48965ccee2b33b718a8935cc43a5b04fbfec6b1c6d686d7466dfda68f1c2b8",
  refresh_token: "1ba8deeb197a5d1288e65a1409dd7be0a0e0392f",
  scope: "employee:all"
});

function getBearerToken() {
  auth.then(result => {
    fs.writeFileSync("./temp/bearer.json", JSON.stringify(result));
  });
}

const auth = getRefreshToken();
const token = getBearerToken();

// Set base URL for Axios requests
const baseUrl = "https://api.lightspeedapp.com/API/Account/214742";

exports.auth = auth;
exports.baseUrl = baseUrl;
exports.token = token;
