// routes/packageRoutes.js
import express from 'express';
import { search } from '../controllers/packageController.js'; // Create this new file

const router = express.Router();

router.get('/search', search);

export default router;