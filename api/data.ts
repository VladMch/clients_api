import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "clients";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const currentTime = new Date();
        const name = req.query.name as string;
        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            if (name == "all") {
                const users = await db.collection(collectionName).find({}).toArray();
                res.status(200).json(users);
            }

            const user = await db.collection(collectionName).findOne({ name });
            if (user) {
                res.json({ isTimeOut: user.expDate < currentTime });
            } else {
                res.status(404).json({ error: 'Пользователь не найден' });
            }

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { name, expDate, pw } = req.body;
        if (pw !== process.env.API_SECRET) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOneAndUpdate(
                { name: name },
                { expDate: new Date(expDate) },
                { upsert: true }
            );

            if (user == null) {
                res.status(500).json({ error: 'Ошка при работе с базой данных' });
            } else if (user.upsertedCount > 0) {
                res.status(201).json({ message: 'Пользователь добавлен', userId: user.upsertedId });
            } else {
                res.status(200).json({ message: 'Пользователь обновлен' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
