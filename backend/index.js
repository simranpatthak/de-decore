import express from 'express';
import "dotenv/config"
import { limiter, logger } from './utils/utils.js';
import authRoute from './routes/auth.route.js';
import productRoute from "./routes/product.route.js"
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"
import cors from "cors"
const app = express();

const port = process.env.PORT ||3000;
app.use(limiter);
app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/admin",adminRoute)
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use((err, req, res, next) => {
    console.log(err);
    
    logger.error(err.message); 
    res.status(500).json({ message: 'Internal Server Error' });
  });

app.listen(port,'0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
