
const fetch = require("node-fetch");
 // loads env variables from .env file

const { CLIENT_ID, APP_SECRET } = {CLIENT_ID: 'AS3S0RMHNo7ha3gq_GfZA010VHi0ZS9oowI09l9zjZm_5V8vxs5YaFVScIrPNShrM118QsHdXgqHNKZT',APP_SECRET: 'EJDbYsUs9iy2mk-b1UCygXvMw8wCSUCumKdHO3_okgjLjWbwyceYbzZ7o2X0pKxsaDyNAms0d3XhQfWY'};
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