import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getState, resetState, buyUnsafe, buySafe } from './controllers/event.controller.js';

const app = express();
const PORT = process.env.PORT || 3004;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsPath = path.join(__dirname, '..', 'src/views');

app.use(express.json());
app.use('/static', express.static(viewsPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

app.get('/api/state', getState);
app.post('/api/reset', resetState);
app.post('/api/buy-unsafe', buyUnsafe);
app.post('/api/buy-safe', buySafe);

app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
});