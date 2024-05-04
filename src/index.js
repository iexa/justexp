import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { getAbsolutePath } from "./utils/esm-path.js"; // from node21 not needed

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "example.com"],
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

app
  .get("/", async (req, res) => {
    let username = req.cookies.username;
    let logged_in = username ? true : false;
    let login_failed = req.query.loginfailed;
    res.render("index", { logged_in, login_failed, username });
  })
  .get("/story/:storyId", async (req, res) => {
    const story_id = req.params.storyId;
    res.render("index_story", { story_id });
  })
  .post("/login", async (req, res) => {
    const { password, username } = req.body;
    if (password === "letmein" && username.trim() !== "") {
      res.cookie("username", username, {
        maxAge: 3600 * 1000,
        httpOnly: true,
      });
      res.redirect("/");
    } else {
      res.redirect("/?loginfailed=1");
    }
    // console.log("pass should be letmein...");
  })
  .get("/logout", async (req, res) => {
    res.clearCookie("username");
    res.redirect("/");
  });

app.listen(process.env.PORT || 3000, () =>
  console.log(`listening at ::1:${process.env.PORT || 3000}`)
);
