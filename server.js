import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import noteRoute from "./routes/noteRoute.js";
import authRoute from "./routes/authRoute.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const app=express();
connectDB();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(cors());

app.use(express.json());

app.use('/api/v1/note',noteRoute);
app.use('/api/v1/auth',authRoute);
app.get("/",(req,res)=>{
    res.send("<h1>Assignment</h1>");
})

const PORT=process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})