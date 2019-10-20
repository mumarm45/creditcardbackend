const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Pragma, Cache-Control"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PUT, POST, HEAD, DELETE"
  );
  next();
});

let cards = [
  {
    id: 1,
    name: "Omar",
    cardNumber: "42342352452",
    limit: 1000,
    balance: 0
  }
];

app.get("/api/cards", (req, res) => {
  const cardsToSend = cards.map(({ id, name, cardNumber, limit, balance }) => ({
    id,
    name,
    cardNumber,
    limit,
    balance
  }));
  res.send(cardsToSend);
});
app.post("/api/cards", (req, res) => {
  const {
    body: { name, cardNumber, limit }
  } = req;
  const id = Math.floor(Math.random() * 100000);
  if (!luhnCheck(cardNumber)) {
    return res.status(400).send({ message: "Credit card invalid" });
  }
  if (isCardExit(cardNumber)) {
    return res.status(400).send({ message: "Credit card already Exist" });
  }
  cards = cards.concat([{ id, name, cardNumber, limit, balance: 0 }]);
  res.send({ id, name, cardNumber, limit, balance: 0 });
});

const isCardExit = num => {
  return !!cards.find(card => card.cardNumber === num);
};
const luhnCheck = num => {
  let arr = (num + "")
    .split("")
    .reverse()
    .map(x => parseInt(x));
  let lastDigit = arr.splice(0, 1)[0];
  let sum = arr.reduce(
    (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
    0
  );
  sum += lastDigit;
  return sum % 10 === 0;
};
app.listen("8088", () => console.log("Started Listening"));
