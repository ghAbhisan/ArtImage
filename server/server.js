import express from 'express';
import cors from 'cors';
import 'dotenv/config'

import userRouter from './routes/userRoutes.js';
import connectDB from './config/mongodb.js';
import imageRouter from './routes/imageRoutes.js';


const app = express();
// app.use(configDotenv());
const PORT = process.env.PORT || 9999;
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
await connectDB();
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get('/', (req, res) => 
    res.send('Hello World!'));


app.listen(PORT, (error) => { 
    if (error) {
        console.error(error);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});