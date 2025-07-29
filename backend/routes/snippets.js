const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');

router.get('/', auth, async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(snippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, code } = req.body;
    const newSnippet = new Snippet({
      title,
      code,
      user: req.user.id,
    });
    const snippet = await newSnippet.save();
    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }

    if (snippet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Snippet.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Snippet removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;