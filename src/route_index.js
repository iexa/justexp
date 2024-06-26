import express from "express";
import asyncify from "express-asyncify";
import { generateApiUrl } from "./utils/index.js";

const route = asyncify(express.Router());

route.use((req, res, next) => {
  // add base_img to all routes' template contexts here
  res.locals.url_base_img = process.env.TMDB_IMG_URL;
  next();
});

route
  // handle home and main search
  .get("/", async (req, res) => {
    const { s: search, cat: category } = req.query;
    if (category && !["movie", "person"].includes(category)) {
      throw new Error("Search category must be a movie or person.");
    }
    let url_to_query = generateApiUrl("movie/now_playing");
    if (category && search) {
      url_to_query = generateApiUrl(`search/${category}`, { query: search });
    }
    const resp = await fetch(url_to_query);
    let data = resp.ok ? await resp.json() : resp.statusText;
    if (category == "person") {
      // person search has multiple result arrays
      data.results = data.results.flatMap((x) => x.known_for);
    }
    // res.json(data);
    res.render("index", { data: data.results, category, search });
  })
  // handle individual movies
  .get("/movie/:id/*", async (req, res, next) => {
    const movie_id = parseInt(req.params.id);
    if (!movie_id) {
      throw new Error("No movie found.");
    }
    const resp = await fetch(generateApiUrl(`movie/${movie_id}`));
    let data;
    if (resp.ok) {
      data = await resp.json();
    } else {
      throw new Error("No movie data found.");
    }
    // res.json(data);
    res.render("single", { data });
  });

export default route;
