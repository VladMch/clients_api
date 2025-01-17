import type { VercelRequest, VercelResponse } from '@vercel/node'
import clientPromise from "../db/dataBase"

const dbName = "test";
const collectionName = "users";

const generateTableHTML = (data: any[]): string => {
    if (!data.length) return '<p>No data available</p>';

    // Создание заголовков таблицы
    const headers = Object.keys(data[0]);
    const headerHTML = headers.map(header => `<th>${header}</th>`).join("");

    // Создание строк таблицы
    const rowsHTML = data.map(row => {
      const cells = headers.map(header => `<td>${row[header]}</td>`).join("");
      return `<tr>${cells}</tr>`;
    }).join("");

    // Формирование полной таблицы
    return `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead><tr>${headerHTML}</tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    `;
  };

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
            
            const users = await db.collection(collectionName).find(
                {api: hash},
                {projection: {_id: 0, api: 0}}
            ).toArray();

            const tableHTML = generateTableHTML(users);
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>JSON to HTML Table</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
              </style>
            </head>
            <body>
              <h1>Generated Table</h1>
              ${tableHTML}
            </body>
            </html>
            `;

            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(html);

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    } else if (req.method === 'POST') {
        const { INN, Phone, Add, Req, Name } = req.body;

        try {
            const client = await clientPromise;
            const db = client.db(dbName);

            const user = await db.collection(collectionName).findOneAndUpdate(
                { name: Name },
                { $inc: {inn: INN, phone: Phone, Probito_po_FIO: Add, Provereno_colichestvo: Req} }
            );

            if (user == null) {
                res.status(500).json({ error: 'Ошка при работе с базой данных' });
            }else {
                res.status(200).json({ message: 'Пользователь обновлен' });
            }

            // return res.status(200).json({ error: 'Данные', user: user, body: req.body, INN: typeof(INN), Phone: typeof(Phone), Add: typeof(Add), Name: typeof(Name)});

        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера: ' + error.message });
        }
    } else {
        res.status(405).json({ error: 'Метод не поддерживается' });
    }
}