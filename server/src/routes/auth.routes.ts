import { Router } from 'express';
import { signup, verifyOtp, login, googleAuth } from '../controllers/auth.controllers';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/google', googleAuth); // Placeholder for Google auth

export default router;