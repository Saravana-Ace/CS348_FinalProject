const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    teamId: { type: Number, required: true },
    teamName: { type: String, required: true },
    position: { type: String, required: true },
    pointsAvg: { type: Number, required: true },
    reboundsAvg: { type: Number, required: true },
    assistsAvg: { type: Number, required: true }
});

module.exports = mongoose.model('Player', playerSchema);