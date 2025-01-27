import express from "express";
import Router from "./src/routes/index.js";
import cors from "cors";
import morgan from "morgan";
const port = 3010;
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
const app = express();
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
  // console.log("Connected to server:", socket.id);

  socket.on("directOrder", async (msg) => {
    // console.log("Received order:", msg);
    try {
      io.emit("directOrder", msg);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.post("/example", (req, res) => {
  console.log(req.body, "cek data");
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
