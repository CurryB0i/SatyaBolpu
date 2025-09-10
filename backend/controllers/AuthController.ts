import { Request, Response } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, uname, email, phone, password } = req.body;

    if (!name || !uname || !email || !phone || !password) {
      return res.status(400).json({ msg: 'Missing Required Field' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    const takenUsername = await User.findOne({ uname });
    if(takenUsername) {
        return res.status(400).json({ msg: 'Username already taken by another user' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      uname,
      email,
      phone,
      password: hashedPassword
    });

    const accessToken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: newUser._id },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        { expiresIn: '7d' }
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      accessToken,
      user: {
        id: newUser._id,
        uname: newUser.uname,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        verified: newUser.verified
      }
    });
  } catch (err: any) {
    console.error('Signup Error:', err.message);
    return res.status(500).json({ msg: 'Something went wrong...' });
  }
};

export const login = async (req: Request,res: Response) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({msg: 'Email and Password are required'});
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(404).json({ msg: 'User Not Found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({ msg: 'Invlaid Credentials' });
    }

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_TOKEN_SECRET!,
        { expiresIn: '5m' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        { expiresIn: '7d' }
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        accessToken,
        user : {
            id: user._id,
            uname: user.uname,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            verified: user.verified
        }
    });
}

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.jwt;
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      { expiresIn: '5m' }
    );

    console.log('Token Refreshed')
    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        uname: user.uname,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (err) {
    console.error('Refresh Error:', err);
    return res.status(403).json({ msg: 'Invalid token' });
  }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.jwt;
    if(!token) return res.status(401).json({ msg: 'Unauthorized' });

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({ message: 'Logged out' });
}
