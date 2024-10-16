import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        const currentTime = new Date();
        try {
            res.json({ isTime: currentTime });
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