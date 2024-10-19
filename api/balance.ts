import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mapBalance } from "../db/storage"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const clientID = req.query.name as string;
        try {
            if (mapBalance.has(clientID)) {
                res.json({ count: mapBalance.get(clientID) });
            } else if (clientID == "all") {
                res.json({ Value: JSON.stringify(Array.from(mapBalance.entries())) });
            } else {
                res.status(404).json({ error: 'Не найдено' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'PATCH') {
        const clientID = req.query.name as string;
        try {
            if (mapBalance.has(clientID)) {
                var x: number = mapBalance.get(clientID)! - 1;
                mapBalance.set(clientID, x);
                x = mapBalance.get("total")! - 1;
                mapBalance.set("total", x)
                res.json({ count: mapBalance.get(clientID) });
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
            mapBalance.set(name, count);
            res.json({ client: name, count: mapBalance.get(name) });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}
