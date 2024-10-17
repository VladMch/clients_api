import type { VercelRequest, VercelResponse } from '@vercel/node'

const map = new Map([
    ["-122540883", 0],
    ["1631207904", 100]
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const clientID:string = req.body;
        try {
            if (map.has(clientID)) {
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