const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 2400;
const Player = require('./player.model');

mongoose.connect('mongodb://localhost:27017/nba', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


app.use(cors());
app.use(express.json());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

app.get('/search-players', async (req, res) => {
    const { firstName } = req.query; // Extract 'position' from the query parameters

    try {
        
        // Query the database for players matching the specified position
        const players = await Player.find({firstName})
        res.json(players); // Send the result as JSON to the frontend
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).send('Error fetching players');
    }
});

app.post('/add-player', async (req, res) => {
    try {
        const { firstName, lastName, teamId, teamName, position } = req.body;
        console.log("Adding player: ", firstName, lastName, "to team:", teamName);
        const newPlayer = new Player({ firstName, lastName, teamId, teamName, position });
        await newPlayer.save();
        res.status(201).json({ message: 'Player added successfully!' });
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ message: 'Failed to add player.' });
    }
});

app.put('/update-player', async (req, res) => {
    const { firstName, lastName, teamId, teamName, position } = req.body;

    try {
        // Find the player by firstName and lastName, then update fields
        const updatedPlayer = await Player.findOneAndUpdate(
            { firstName, lastName },
            { teamId, teamName, position },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedPlayer) return res.status(404).send('Player not found');
        
        res.json(updatedPlayer); // Respond with the updated player data
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).send('Error updating player');
    }
});

app.delete('/delete-player', async (req, res) => {
    const { firstName, lastName } = req.body;

    try {
        const deletedPlayer = await Player.findOneAndDelete({ firstName, lastName });

        if (!deletedPlayer) {
            return res.status(404).send('Player not found');
        }
        
        res.json({ message: 'Player deleted successfully!' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).send('Error deleting player');
    }
});