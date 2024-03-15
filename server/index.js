const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require("./config/db");

const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const chartRouter = require("./routes/charts");

app.get("/", (req, res) =>
  res.json({
    msg: "All good",
  })
);

app.use("/user", userRouter);
app.use("/account", accountRouter);
app.use("/chart", chartRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
