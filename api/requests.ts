import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "users";

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
                {projection: {_id: 0, api: 0, resetAt: 0}}
            ).toArray();
            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { INN, Phone, Add, Name } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOneAndUpdate(
                { name: Name },
                { $inc: {inn: INN, phone: Phone, Probito_po_FIO: Add} }
            );

            if (user == null) {
                res.status(500).json({ error: 'Ошка при работе с базой данных' });
            }else {
                res.status(200).json({ message: 'Пользователь обновлен' });
            }

            // return res.status(200).json({ error: 'Данные', user: user, body: req.body, INN: typeof(INN), Phone: typeof(Phone), Add: typeof(Add), Name: typeof(Name)});

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
