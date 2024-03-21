const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { addSession, removeSession } = require("./config/sessionManager");

require("dotenv").config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const userRouter = require("./routes/user");
const accountRouter = require("./routes/account");
const chartRouter = require("./routes/charts");
const loanRouter = require("./routes/loan");
const notificationRouter = require("./routes/notifications");

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.get("/", (req, res) =>
  res.json({
    msg: "All good",
  })
);

app.use("/user", userRouter);
app.use("/account", accountRouter);
app.use("/chart", chartRouter);
app.use("/loan", loanRouter);
app.use("/notification", notificationRouter);

let user;
io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    user = userId;
    addSession(userId, socket);
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on("disconnect", () => {
    console.log(`User ${user} disconnected`);
    removeSession(user);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
