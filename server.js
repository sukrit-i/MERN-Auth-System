import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";

// ✅ Create an Express application instance
const app = express();
// ✅ Use environment variable PORT, fallback to 4000
const port = process.env.PORT || 4000;
// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware: parse incoming JSON requests
// This means if a client sends { "name": "Sukriti" },
// it will be automatically converted into a JavaScript object
// and available as req.body in your routes.
app.use(express.json()); // all req will be passed using json 
app.use(cookieParser());
app.use(cors({credentials: true})); // to allow cookies to be sent across origins

//API endpoints 
app.use('/api/auth', authRouter);

app.get('/', (req, res)=>res.send('API is running....fine'));

app.listen(port, ()=>console.log(`Server started on PORT :${port}`)); 