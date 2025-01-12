import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "history";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const Api = req.query.api as string;
        try {
            const client = await clientPromise;
            const db = client.db(dbName);
            var hash = 0,
            i, chr;
            if (Api.length === 0) return hash;
            for (i = 0; i < Api.length; i++) {
                chr = Api.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            hash = ((hash >> 4) * 2) << 4;
            
            const users = await db.collection(collectionName).find(
                {api: hash},
                {projection: {_id: 0, api: 0}}
            ).toArray();
            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
