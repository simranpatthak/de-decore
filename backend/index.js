import express from 'express';
import "dotenv/config"
import { limiter, logger } from './utils/utils.js';
import authRoute from './routes/auth.route.js';
import productRoute from "./routes/product.route.js"
import userRoute from "./routes/user.route.js"
const app = express();

const port = process.env.PORT ||3000;
app.use(limiter);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.use((err, req, res, next) => {
    console.log(err);
    
    logger.error(err.message); 
    res.status(500).json({ message: 'Internal Server Error' });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
