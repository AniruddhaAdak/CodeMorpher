export interface Language {
  name: string;
  extension: string;
}

export interface ConversionOptions {
  optimization: 'performance' | 'readability' | 'maintainability';
  environment: 'web' | 'mobile' | 'desktop' | 'embedded';
  styleGuide: 'standard' | 'google' | 'airbnb';
}