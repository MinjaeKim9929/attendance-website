const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res) => {
	try {
		const items = await Item.find();
		res.json(items);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post('/', async (req, res) => {
	const item = new Item({
		name: req.body.name,
		description: req.body.description,
	});
	try {
		const newItem = await item.save();
		res.status(201).json(newItem);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = router;
