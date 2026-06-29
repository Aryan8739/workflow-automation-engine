import express from 'express';
const router = express.Router();
import Workflow from '../models/Workflow.js';

// POST /api/workflows - create a workflow
router.post('/', async (req, res) => {
  try {
    const workflow = new Workflow(req.body);
    await workflow.save();
    res.status(201).json(workflow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/workflows - list all workflows
router.get('/', async (req, res) => {
  try {
    const workflows = await Workflow.find().select('-nodes -edges');
    res.json(workflows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workflows/:id - get one workflow
router.get('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    res.json(workflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/workflows/:id - update a workflow
router.put('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    res.json(workflow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/workflows/:id - delete a workflow
router.delete('/:id', async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
