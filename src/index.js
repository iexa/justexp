import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { getAbsolutePath } from "./utils/esm-path.js"; // from node21 not needed
import debug from "debug";
import logger from "morgan";
import createError from "http-errors";

const dbg = debug("app:srv");

const app = express();
app.use(logger("short"));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "cdnjs.cloudflare.com"],
      },
    },
  })
); // security

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(getAbsolutePath(import.meta.url, "../pub")));
app.set("views", getAbsolutePath(import.meta.url, "views"));
app.set("view engine", "ejs");
// https://stackoverflow.com/questions/39781767/using-nunjucks-in-an-express-app

// MAIN routes
//--------------
app.get("/", async (req, res) => {
  res.render("index", {});
});

// ERROR HANDLERS
app.use((req, res, next) => next(createError(404)));
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const srv = app.listen(process.env.PORT || 3000, () => {
  dbg(`listening at ::1:${process.env.PORT || 3000}`);
});

srv.onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
