import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js'
import districtRoutes from './routes/districtRoutes.js'
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());



app.get("/",(req,res)=>{
  res.send("Backend is running");
})

// Routes
app.use('/', authRoutes);

app.use('/', packageRoutes);
app.use('/', districtRoutes);
// app.use('/api/packages', packageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${PORT}`);
});
