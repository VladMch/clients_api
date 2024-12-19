import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "users";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        const { Name, Api } = req.body;
        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOne({ Name });
            if (user) {
                res.json({ message: 'OK' });
            } else {
                await db.collection(collectionName).insertOne(
                    {api: Api, name: Name, inn: 0, phone: 0, getFinanceDataByFioDob: 0}
                );
    
                res.status(404).json({ error: 'Пользователь не найден' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } 
}