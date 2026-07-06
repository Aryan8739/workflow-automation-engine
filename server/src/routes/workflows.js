import express from 'express';
const router = express.Router();
import Workflow from '../models/Workflow.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

// GET /api/workflows/demo - the curated public demo (always accessible, unauthenticated)
router.get('/demo', async (req, res) => {
  try {
    const workflow = await Workflow.findOne({ owner: null });
    if (!workflow) return res.status(404).json({ error: 'No demo workflow available' });
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workflows - a user's own workflows, or the curated demo(s) for guests
router.get('/', optionalAuth, async (req, res) => {
  try {
    const filter = req.userId ? { owner: req.userId } : { owner: null };
    const workflows = await Workflow.find(filter).select('-nodes -edges');
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workflows - create a workflow owned by the authenticated user
router.post('/', requireAuth, async (req, res) => {
  try {
    const workflow = new Workflow({ ...req.body, owner: req.userId });
    await workflow.save();
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/workflows/:id - get one workflow (owner or the public demo)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    if (workflow.owner && (!req.userId || workflow.owner.toString() !== req.userId)) {
      return res.status(403).json({ error: 'Not authorized to access this workflow' });
    }
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/workflows/:id - update a workflow (owner only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    if (!workflow.owner || workflow.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to modify this workflow' });
    }
    Object.assign(workflow, req.body);
    await workflow.save();
    res.json(workflow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/workflows/:id - delete a workflow (owner only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    if (!workflow.owner || workflow.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this workflow' });
    }
    await workflow.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
