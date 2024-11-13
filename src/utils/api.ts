import axios from 'axios';
import { ConversionOptions } from '../types';

const API_URL = 'http://localhost:3001/api';

export async function convertCode(
  sourceCode: string,
  sourceLang: string,
  targetLang: string,
  options: ConversionOptions
): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/convert`, {
      sourceCode,
      sourceLang,
      targetLang,
      options,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error('Failed to convert code');
  }
}