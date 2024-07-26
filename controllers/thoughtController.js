const Thought = require('../models/thought');
const User = require('../models/user');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve thoughts', details: err });
        }
    },
    
    // Get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve thought', details: err });
        }
    },
    
    // Create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to create thought', details: err });
        }
    },
    
    // Update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update thought', details: err });
        }
    },
    
    // Delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json({ message: 'Thought deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete thought', details: err });
        }
    },

    // Create a reaction
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Failed to add reaction', details: err });
        }
    },

    // Delete a reaction
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: 'Failed to remove reaction', details: err });
        }
    }
};