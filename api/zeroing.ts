import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "users";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const users = await db.collection(collectionName).updateMany(
                {},
                {$set: {inn: 0, phone: 0, Probito_po_FIO: 0}}
            );
            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}