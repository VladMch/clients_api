import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "clients"; //todo peredelat (vinesti v db)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const name = req.query.name as string;
        const client = await clientPromise;
        const db = client.db(dbName);

        if (name == "all") {
            const users = await db.collection(collectionName).find({}).toArray();
            res.status(200).json(users);
        }

        try {
            const user = await db.collection(collectionName).findOne({ name });
            if (user) {
                res.json({ count: user.count });
            } else {
                res.status(404).json({ error: 'Не найдено' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'PATCH') {
        const { name, count } = req.body;
        const client = await clientPromise;
        const db = client.db(dbName);
        try {
            const user = await db.collection(collectionName).findOneAndUpdate(
                { name: name },
                { $inc: { count: -count } }
            );
            if (user) {
                res.json({ count: user.count - count});
            } else {
                res.status(404).json({ error: 'Не найдено' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }

    } else if (req.method === 'POST') {
        const { name, count, pw } = req.body;

        if (pw !== process.env.API_SECRET) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        if (!name || typeof count !== 'number' || count < 0) {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOneAndUpdate(
                { name: name },
                { count: count },
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
