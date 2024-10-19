import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.DATABASE_URL) {
    throw new Error('Добавьте MONGODB_URI в переменные окружения');
}

client = new MongoClient(uri);
clientPromise = client.connect();

export default clientPromise;