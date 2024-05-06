import express from "express";
import { generateApiUrl } from "./utils/index.js";

const route = express.Router();

route.use((req, res, next) => {
  // add base_img to all routes' template contexts here
  res.locals.url_base_img = process.env.TMDB_IMG_URL;
  next();
});

route
  .get("/", async (req, res) => {
    const resp = await fetch(generateApiUrl("movie/now_playing"));
    let data;
    if (resp.ok) {
      data = await resp.json();
    } else {
      data = resp.statusText;
    }
    res.render("index", { data: data.results });
    // res.json(data);
  })
  .get("/movie/:id/*", async (req, res, next) => {
    const movie_id = parseInt(req.params.id);
    if (!movie_id) {
      next(new Error("No movie found."));
      return;
    }
    const resp = await fetch(generateApiUrl(`movie/${movie_id}`));
    let data;
    if (resp.ok) {
      data = await resp.json();
    } else {
      next(new Error("No movie data found."));
      return;
    }
    // res.json(data);
    res.render("single", { data });
  });

export default route;
