import express from "express";
import Router from "./src/routes/index.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { createTransactions } from "./src/controller/transactionController.js";
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  morgan("dev", {
    skip: (req) => req.url.includes("/socket.io/"),
  })
);
app.use(Router);
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinCafe", (id_outlet) => {
    socket.join(`cafe_${id_outlet}`);
    console.log(`User ${socket.id} joined cafe_${id_outlet}`);
  });

  socket.on("order", async ({ id_outlet, orderData }) => {
    console.log(`Pesanan diterima untuk cafe_${id_outlet}:`, orderData);
    await createTransactions(id_outlet, orderData);
    io.to(`cafe_${id_outlet}`).emit("newOrder", orderData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.post("/example", (req, res) => {
  console.log(req.body, "cek data");
  res.json(req.body);
});
server.listen(port, () => {
  console.log(`running on port ${port}`);
});
