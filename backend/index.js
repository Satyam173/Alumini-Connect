import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from './utils/db.js';
dotenv.config({});
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'


const app = express();
const PORT =  8000 ;



app.get("/", (req,res)=>{
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    })
})

//middlewares 

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // if you're dealing with cookies or sessions
}));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server listen at port at ${PORT}`);
    
})