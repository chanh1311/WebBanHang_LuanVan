require('dotenv').config({ path: 'src/config.env' });
const fetch = require("node-fetch");
 // loads env variables from .env file

const { CLIENT_ID, APP_SECRET } = {CLIENT_ID: process.env.CLIENT_ID,APP_SECRET: process.env.APP_SECRET};
const base = "https://api-m.sandbox.paypal.com";

async function createOrder(totalUSD) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: `${totalUSD}`,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}

async function generateAccessToken() {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

exports.createOrder = createOrder;
exports.capturePayment = capturePayment;