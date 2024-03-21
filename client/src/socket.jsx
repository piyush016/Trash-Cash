import socketIOClient from "socket.io-client";

const socket = socketIOClient(process.env.API_URL);

export default socket;
