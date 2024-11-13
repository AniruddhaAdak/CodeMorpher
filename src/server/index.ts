import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { z } from 'zod';
import { convertCodeLogic } from './services/converter';
import { errorHandler } from './middleware/errorHandler';
import { validateRequest } from './middleware/validateRequest';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Request validation schema
const convertRequestSchema = z.object({
  sourceCode: z.string().min(1),
  sourceLang: z.string().min(1),
  targetLang: z.string().min(1),
  options: z.object({
    optimization: z.enum(['performance', 'readability', 'maintainability']),
    environment: z.enum(['web', 'mobile', 'desktop', 'embedded']),
    styleGuide: z.enum(['standard', 'google', 'airbnb']),
  }),
});

// Routes
app.post(
  '/api/convert',
  validateRequest(convertRequestSchema),
  async (req, res, next) => {
    try {
      const { sourceCode, sourceLang, targetLang, options } = req.body;
      const result = await convertCodeLogic(
        sourceCode,
        sourceLang,
        targetLang,
        options
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});