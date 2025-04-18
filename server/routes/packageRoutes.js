// routes/packageRoutes.js
import express from 'express';
import { packages, search } from '../controllers/packageController.js'; // Create this new file


const router = express.Router();

router.get('/search', search);
router.get('/packages', packages);

export default router;