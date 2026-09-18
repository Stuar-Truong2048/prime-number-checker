import express from "express";
import { readWatchlists, writeWatchlists } from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();


router.use(authenticate);


router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const watchlists = readWatchlists();
  const userWatchlist = watchlists[userId] || [];
  return res.status(200).json(userWatchlist);
});


router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { userId } = req.params;
  const newMovie = { ...req.body };
  const watchlists = readWatchlists();

  if (!watchlists[userId]) {
    watchlists[userId] = [];
  }

  
  const maxId = watchlists[userId].reduce((max, movie) => {
    return (movie.id && movie.id > max) ? movie.id : max;
  }, 0);

  newMovie.id = maxId + 1;

  watchlists[userId].push(newMovie);
  writeWatchlists(watchlists);

  return res.status(201).json(newMovie);
});


router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;
  const watchlists = readWatchlists();

  if (!watchlists[userId]) {
    return res.status(404).json({ error: "Watchlist not found" });
  }

  const movieIndex = watchlists[userId].findIndex(
    (m) => String(m.id) === String(movieId)
  );

  if (movieIndex === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }

  watchlists[userId][movieIndex] = {
    ...watchlists[userId][movieIndex],
    ...req.body,
  };

  writeWatchlists(watchlists);
  return res.status(200).json(watchlists[userId][movieIndex]);
});


router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const { userId, movieId } = req.params;
  const watchlists = readWatchlists();

  if (!watchlists[userId]) {
    return res.status(404).json({ error: "Watchlist not found" });
  }

  const initialLength = watchlists[userId].length;
  watchlists[userId] = watchlists[userId].filter(
    (m) => String(m.id) !== String(movieId)
  );

  if (watchlists[userId].length === initialLength) {
    return res.status(404).json({ error: "Movie not found" });
  }

  writeWatchlists(watchlists);
  return res.status(200).json({ message: "Movie deleted" });
});

export default router;