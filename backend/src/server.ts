import express from 'express';
import cors from 'cors';
import categoriesRouter from './routes/categoriesRouter';
import swordsRouter from './routes/swordsRouter';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/swords', swordsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});