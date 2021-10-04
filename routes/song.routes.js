const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");

const Song = require("../models/Song.model");
const Task = require("../models/Task.model");
const User = require("../models/User.model");

//  POST /api/projects  -  Creates a new project
router.post("/songs", (req, res, next) => {
  const { title, description } = req.body;

  Song.create({ title, description, tasks: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/prueba", (req, res, next) => {
  axios
    .get("https://openwhyd.org/u/61561e4608ced3543d922165?format=json")
    .then((response) => res.json(response.data))
    .catch((error) => console.log(error));
});

router.post("/favourite", (req, res, next) => {
  console.log("BACKEND FAVORITO", req.body);
  const title = req.body.song.name;
  const image = req.body.song.img;
  const video = req.body.song.text;
  console.log("NO ENTRA FAVORITOS??", req.body.user);

  Song.create({ title, image, video }).then((song) => {
    console.log("SONG DE CREATE!!", song);
    User.findByIdAndUpdate(req.body.user._id, {
      $push: { favourites: song._id },
    })
      .then((data) => {
        console.log("DATA DE THEN", data);
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  });
});

router.post("/getfavourites", (req, res, next) => {
  console.log("VFAOIJF", req.body);
  User.findById(req.body.user._id).then((response) => {
    console.log("JUJITSU", response);
    const ids = response.favourites;
    Song.find()
      .where("_id")
      .in(ids)
      .exec((err, records) => {
        console.log("ERORR", err);
        console.log("RECORDDDDS", records);
        res.json(records);
      });
  });
});

router.post("/removefavourite", (req, res, next) => {
  console.log("REMOVE FAVOURITE");
  console.log("RQEUEST DOT BODY!!", req.body);
  User.findByIdAndUpdate(req.body.user._id, {
    $pull: { favourites: req.body._id },
  }, {
    new:true
  })
  .then((data) => {
    res.json(data);


    console.log("REMOVEEED DE DATA", data);
  });
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/songs", (req, res, next) => {
  Song.find()
    .populate("tasks")
    .then((allSongs) => res.json(allSongs))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/songs/:songId", (req, res, next) => {
  const { songId: songId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(songId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Song.findById(songId)
    .populate("tasks")
    .then((song) => res.status(200).json(song))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/songs/:songId", (req, res, next) => {
  const { songId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Song.findByIdAndUpdate(songId, req.body, { new: true })
    .then((updatedSong) => res.json(updatedSong))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("songs/:songId", (req, res, next) => {
  const { songId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(songId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Song.findByIdAndRemove(songId)
    .then(() =>
      res.json({
        message: `Song with ${songId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
