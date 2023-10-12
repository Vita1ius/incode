import express from 'express';
import { config } from 'dotenv';
import router from './route/route.js';

const app = express();
app.use(express.json());
config();
const port = process.env.PORT || 5000;
app.use(router)

app.get('/',async (req, res) => {
  try {
      res.json('Hello dude')
  } catch (error) {
      res.json(error)
  }
})

app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`)
})