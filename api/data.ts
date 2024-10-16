import type { VercelRequest, VercelResponse } from '@vercel/node'

import Client from '../db/clientModel';
import DB from '../db/connectDB';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    DB;
    if (req.method === 'GET') {
        const currentTime = new Date();
        try {
            const client = await Client.findOne({ name: "-122540883" });
            if (client) {
                res.json({ isTimeOut: client.expDate! < currentTime });
            } else {
                res.status(404).json({ error: 'Пользователь не найден' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { pw } = req.body;
        if (pw !== process.env.API_SECRET) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        try {
            res.json({ client: "true" });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}
