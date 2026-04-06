import { Router } from 'express';
import { getValue, setValue, clearAll } from '../db/database.js';

const router = Router();

router.get('/:key', (req, res) => {
  const data = getValue(req.params.key);
  res.json({ data: data || [] }); // Return empty array if null
});

router.post('/:key', (req, res) => {
  setValue(req.params.key, req.body.data);
  res.json({ success: true });
});

router.delete('/', (req, res) => {
  clearAll();
  res.json({ success: true });
});

export default router;
