import express from "express";
import asyncify from "express-asyncify";

import { generateApiUrl } from "./utils/index.js";

const route = asyncify(express.Router());

route.get("/", async (req, res) => {
  res.json("hello!");
});

export default route;
