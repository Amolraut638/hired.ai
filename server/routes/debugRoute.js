import express from 'express';
import debugController from '../controllers/debugController.js';

const router = express.Router();

// GET /debug/gemini-test?secret=...  (optional secret when DEBUG_SECRET is set)
router.get('/gemini-test', debugController.geminiTest);

export default router;
