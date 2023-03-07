require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 5001;

const userRouter = require("./users/routes");

const User = require("./users/model");

const app = express();

app.use(express.json());

const syncTables = () => {
  User.sync({ alter: true, force: false });
};

app.use(userRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "api is working" });
});

app.listen(port, () => {
  syncTables();
  console.log(`App listening on port ${port}`);
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjc4MjA0NjcyfQ.wwbQPuM3PpOkGKXRkYnHfKH2gVcXh6TMVaJ_EDVnTfU
