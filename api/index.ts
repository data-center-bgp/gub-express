import express from "express";
import cors from "cors";
import createServer from "http";

import { userRouter } from "./user/user.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});