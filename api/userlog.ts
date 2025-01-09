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

            const user = await db.collection(collectionName).findOne({ name: Name });
            if (user) {
                res.json({ message: 'OK' });
            } else {
                await db.collection(collectionName).insertOne(
                    {api: Api, name: Name, inn: 0, phone: 0, Probito_po_FIO: 0, Provereno_colichestvo: 0}
                );
                res.json({ message: 'Создан новый пользователь ' + Name });
            }

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } 
}