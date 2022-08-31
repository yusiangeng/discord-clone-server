import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import friendInvitationRouter from "./routes/friendInvitations";
import { registerSocketServer } from "./socketServer";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/friend-invitation", friendInvitationRouter);

const httpServer = http.createServer(app);
registerSocketServer(httpServer);

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  if (err instanceof Error) {
    console.log(`Error: ${err.message}`);
  }
  httpServer.close(() => process.exit(1));
});
