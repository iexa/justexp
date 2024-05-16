import express from "express";
import asyncify from "express-asyncify";

import movies from "./data/movies.js"; // for proper json data with {type:'json'}
import movie_details from "./data/movie_details.js";

import { generateApiUrl } from "./utils/index.js";
import { deleteToken } from "@dotenvx/dotenvx/src/shared/store.js";

const router = asyncify(express.Router());
const route_movies = asyncify(express.Router());

// can be used to check for api access token, etc.
router.use(async (req, res, next) => {
  // console.log("api accessed");
  // if (req.query.api_key != 555) {
  //   res.status(401).json({ error: "invalid api key" });
  //   return;
  // }
  next();
});
// ---------------

router.use("/movie", route_movies);

route_movies
  .get("/most_popular", async (req, res) => {
    res.json(movies.filter((x) => x.most_popular));
  })
  .get("/top_rated", async (req, res) => {
    res.json(movies.sort((x, y) => y.vote_average - x.vote_average));
  })
  .get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const detail = movie_details.find((x) => x.id === id);
    if (!id || !detail) {
      res.json({ error: "No movie found with that id." });
      return;
    }
    res.json(detail);
  })
  .route("/:id/rating") // same route different methods
  .get(async (req, res) => {
    res.send("rating");
  })
  .post(async (req, res) => {})
  .delete(async (req, res) => {});

export default router;
