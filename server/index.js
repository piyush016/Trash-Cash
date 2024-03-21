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
    origin: ["http://localhost:5173", "https://trash-cash.vercel.app/"],
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

io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    addSession(userId, socket);
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    removeSession(userId);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
