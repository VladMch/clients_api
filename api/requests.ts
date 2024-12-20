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
            
            const users = await db.collection(collectionName).find({api: hash}).toArray();
            res.status(200).json(Api + ' -> ' + hash + ' -> ' + users);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { INN, Phone, Add, Name, Api } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            // const parsedData = {
            //     INN: Number(INN),
            //     Phone: Number(Phone),
            //     Add: Number(Add),
            //   };

            if (!Name || typeof INN !== 'number' || Phone !== 'number') {
                return res.status(400).json({ error: 'Неверные данные', body: req.body, INN: INN, Phone: Phone, Add: Add, Name:Name, Api:Api});
            }

            // const user = await db.collection(collectionName).findOneAndUpdate(
            //     { name: Name },
            //     { $inc: {inn: INN, phone: Phone, getFinanceDataByFioDob: Add}, $set: {api: Api} },
            //     { upsert: true }
            // );

            var user = await db.collection(collectionName).findOne({ name: Name });
            if (user == null) {
                res.status(500).json({ error: 'Ошка при работе с базой данных' });
                return;
            }

            await db.collection(collectionName).updateOne({ name: Name }, { $inc: {inn: INN, phone: Phone, getFinanceDataByFioDob: Add}, $set: {api: Api} },{ upsert: true });

            // if (user.upsertedCount > 0) {
            //     res.status(201).json({ message: 'Пользователь добавлен', userId: user.upsertedId });
            // } else {
            //     res.status(200).json({ message: 'Пользователь обновлен' });
            // }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}
