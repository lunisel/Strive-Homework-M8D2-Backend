import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRouter from "./sevices/user/index.js";

const port = process.env.PORT;
const mongoConnection = process.env.MONGO_CONNECTION_STRING;
const server = express();

server.use(cors());
server.use(express.json());

server.use("/users", userRouter);

console.table(listEndpoints(server));

server.listen(port, async () => {
  try {
    mongoose.connect(mongoConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Server is running and connected to DB on port ", port);
  } catch (err) {
    console.log("Db connection is faild", err);
  }
});
