const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET /api/transactions - list (optionally filter by type/date/etc via query)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    // Example: ?type=income
    if (req.query.type) filter.type = req.query.type;
    if (req.query.start || req.query.end) {
      filter.date = {};
      if (req.query.start) filter.date.$gte = new Date(req.query.start);
      if (req.query.end) filter.date.$lte = new Date(req.query.end);
    }
    const items = await Transaction.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/transactions - create
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    const t = new Transaction({ title, amount, type, category, date, notes });
    const saved = await t.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// GET /api/transactions/:id - get single
router.get("/:id", async (req, res) => {
  try {
    const t = await Transaction.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid id" });
  }
});

// PUT /api/transactions/:id - update
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE /api/transactions/:id - delete
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Transaction.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;
