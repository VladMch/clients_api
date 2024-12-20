import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "users";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        const { Name, Api } = req.body;
        var currentTime = new Date();
        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOne({ name: Name });
            if (user) {
                if(user.resetAt < currentTime){
                    currentTime.setDate(currentTime.getDate() + 1);
                    await db.collection(collectionName).updateOne(
                        {name: Name},
                        {$set: {inn: 0, phone: 0, getFinanceDataByFioDob: 0, resetAt: currentTime}}
                    )
                    res.json({ message: 'User resetted' });
                }
                res.json({ message: 'OK' });
            } else {
                currentTime.setDate(currentTime.getDate() + 1);
                await db.collection(collectionName).insertOne(
                    {api: Api, name: Name, inn: 0, phone: 0, getFinanceDataByFioDob: 0, resetAt: currentTime}
                );
                res.json({ message: 'Создан новый пользователь ' + Name });
            }

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } 
}