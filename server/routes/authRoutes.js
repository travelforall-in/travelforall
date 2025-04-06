// routes/authRoutes.js

import express from 'express';
import { signup,login,subscribe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/subscribe', subscribe);



export default router;
