export class ConversionError extends Error {
  constructor(
    message: string,
    public sourceLang: string,
    public targetLang: string
  ) {
    super(message);
    this.name = 'ConversionError';
  }
}