import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  id: Number,
  name: String,
  fullName: String,
  league: String,
  country: String,
  squad: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Players'}], // Object Id of players
});

const playerSchema = new mongoose.Schema({
  id: Number,
  name: String,
  shirtNumber: Number,
  position: String,
  currentClub: {type: mongoose.SchemaTypes.ObjectId, ref: 'Clubs'}, // Object Id of current club
  clubsPlayedFor: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Clubs'}], // Object Id of Clubs
});

const gameSchema = new mongoose.Schema({
  id: String,
  playerIds: Array,
  socketIds: Array,
  gameData: Object,
  gameStatus: String,
})

export const clubModel = mongoose.model("Clubs", clubSchema)
export const playerModel = mongoose.model("Players", playerSchema)
export const gameModel = mongoose.model("Games", gameSchema)
