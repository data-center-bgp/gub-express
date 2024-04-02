import express from "express";
import cors from "cors";
import { createServer } from "http";

import { userRouter } from "./user/user.router";

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}!`)
});