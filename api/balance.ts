import type { VercelRequest, VercelResponse } from '@vercel/node'

const map = new Map([
    ["total", 0],
    ["1201391232", 0],
    ["1631207904", 0]
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const clientID = req.query.name;
        try {
            if (typeof clientID === 'string' && map.has(clientID)) {
                res.json({ count: map.get(clientID) });
            } else if (clientID == "all") {
                res.json({ Value: JSON.stringify(Array.from(map.entries())) });
            } else {
                res.status(404).json({ error: 'Не найдено' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'PATCH') {
        const clientID = req.query.name;
        try {
            if (typeof clientID === 'string' && map.has(clientID)) {
                var x:number = map.get(clientID)! - 1;
                map.set(clientID, x);
                x = map.get("total")! - 1;
                map.set("total", x);
                res.json({ count: map.get(clientID) });
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
            map.set(name, count);
            res.json({ client: name, count: map.get(name) });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}
