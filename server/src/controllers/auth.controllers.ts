import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/mailer';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: User provides details, we send OTP
export const signup = async (req: Request, res: Response) => {
  const { email, name, dateOfBirth } = req.body;
  if (!email || !name || !dateOfBirth) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user = new User({ email, name, dateOfBirth, otp, otpExpires });
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Step 2: User sends OTP, we verify and return JWT
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(404).json({ message: 'User not found or OTP not requested' });
    }
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// For login, generate and send a new OTP
export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email for login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
    // This is a placeholder. A full implementation requires Google Cloud project setup.
    // The flow would involve receiving a token from the frontend, verifying it with Google,
    // then finding or creating a user in your DB and returning a JWT.
    const { name, email, googleId } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name,
                email,
                googleId,
                dateOfBirth: new Date(), // You might need to ask for this on the frontend
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}