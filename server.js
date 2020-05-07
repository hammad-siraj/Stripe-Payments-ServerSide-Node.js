const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")("secret_key_will_go_here");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => {
  res.send(
    "<html><h1>Stripe payment methods</h1><ul><li>Alipay</li><li>Card payment</li><li>New card payment API</li></ul></html>"
  );
});

app.post("/payment_alipay", (req, res) => {
  console.log("req", req.body.sourceId);
  const body = {
    amount: req.body.amount,
    currency: req.body.currency,
    source: req.body.sourceId,
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log(stripeErr);
      res.status(500).send({ error: stripeErr });
    } else {
      console.log(stripeRes);
      res.status(200).send({ success: stripeRes });
    }
  });
});

app.post("/payment", (req, res) => {
  console.log("req", req.body.tokenId);
  const body = {
    source: req.body.tokenId,
    amount: 100,
    currency: "usd",
    description: "statement",
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log(stripeErr);
      res.status(500).send({ error: stripeErr });
    } else {
      console.log(stripeRes);
      res.status(200).send({ success: stripeRes });
    }
  });
});

app.post("/payment_paymentIntents", async (req, res) => {
  console.log("payment_react");
  const body = {
    source: req.body.tokenId,
    amount: 100,
    currency: "usd",
  };

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    // Verify your integration in this guide by including this parameter
    metadata: { integration_check: "accept_a_payment" },
  });
  res.status(200).send(paymentIntent.client_secret);
});
