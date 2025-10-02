const express = require('express');
const router = express.Router();
const controller = require('./categoriesController');
const authenticate = require('../auth/authMiddleware');

router.get('/', authenticate, async (req, res) => {
  try {
    const type = req.query.type;
    const categories = await controller.getAll(req.user.id, req.query.q, type);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const category = await controller.getById(req.user.id, req.params.id);
    res.json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, type, isActive } = req.body;
    const category = await controller.create(req.user.id, name, description, type, isActive);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await controller.update(req.user.id, req.params.id, name, description, isActive);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await controller.remove(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
