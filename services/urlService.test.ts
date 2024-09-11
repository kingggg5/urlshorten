import { createShortUrl } from '../services/urlService';
import mongoose from 'mongoose';

beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI as string;
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not set');
    }
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
});

test('should create a short URL', async () => {
    const url = 'http://example.com';
    const result = await createShortUrl(url);
    expect(result).toHaveProperty('key');
    expect(result.url).toBe(url);
});
