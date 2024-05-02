import express from "express";
import helmet from "helmet";
import { getAbsolutePath } from "./utils/esm-path.js";

const app = express();
app.use(helmet()); // security
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(getAbsolutePath(import.meta.url, "../pub")));

app.post("/ajax", async (req, res) => {
  console.log("ajax post");
  res.json({ data: "hello!" });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`listening at ::1:${process.env.PORT || 3000}`)
);
