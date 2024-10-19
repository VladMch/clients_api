import type { VercelRequest, VercelResponse } from '@vercel/node'

const map = new Map([
    ["1201391232", new Date()],
    ["1631207904", new Date()]
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const currentTime = new Date();
        const client = req.query.client;
        try {
            if (typeof client === 'string' && map.has(client)) {
                res.json({ isTimeOut: map.get(client)! < currentTime });
            } else if (client == "all") {
                res.json({ Value: JSON.stringify(Array.from(map.entries())) });
            } else {
                res.status(404).json({ error: 'Пользователь не найден' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { client, expDate, pw } = req.body;
        if (pw !== process.env.API_SECRET) {
            return res.status(401).json({ error: 'Неверный пароль' });
        }

        if (!client) {
            return res.status(400).json({ error: 'Неверные данные' });
        }

        if (!(expDate instanceof Date)) {
            return res.status(400).json({ error: 'Некорректная дата' });
        }

        try {
            map.set(client, new Date(expDate));
            res.json({ client: client, date: map.get(client) });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}
