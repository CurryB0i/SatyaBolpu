import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';
import postRoutes from './routes/PostRoutes.js';
import tagRoutes from './routes/TagRoutes.js';
import cultureRoutes from './routes/CultureRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import cookieParser from 'cookie-parser';
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
connectDB()

app.get('/api', (req, res) => res.send('Hello World!'));
app.use('/api/auth',authRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/cultures',cultureRoutes);
app.use('/api/tags',tagRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
