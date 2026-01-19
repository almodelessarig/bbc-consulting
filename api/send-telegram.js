// Vercel Serverless Function для отправки заявок в Telegram
export default async function handler(req, res) {
  // Настройки Telegram бота
  const TELEGRAM_BOT_TOKEN = '8594639110:AAGH2RDDc_JvCj7h4yiMBQNxQcwkzr4Z3sg';
  const TELEGRAM_CHAT_ID = '-5159467674';

  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight запроса
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Проверка метода запроса
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Метод не разрешен' });
    return;
  }

  try {
    // Получение данных из запроса
    const data = req.body;

    // Валидация обязательных полей
    if (!data.name || !data.phone) {
      res.status(400).json({ success: false, message: 'Заполните все обязательные поля' });
      return;
    }

    // Извлечение данных
    const name = String(data.name || '').trim();
    const phone = String(data.phone || '').trim();

    // Данные из квиза
    const employees = String(data.employees || 'Не указано').trim();
    const turnover = String(data.turnover || 'Не указано').trim();
    const services = String(data.services || 'Не указано').trim();
    const problems = String(data.problems || 'Не указано').trim();

    // UTM метки
    const utm_source = String(data.utm_source || 'Прямой заход').trim();
    const utm_medium = String(data.utm_medium || '-').trim();
    const utm_campaign = String(data.utm_campaign || '-').trim();
    const utm_term = String(data.utm_term || '-').trim();
    const utm_content = String(data.utm_content || '-').trim();

    // Дополнительные данные
    const page_url = String(data.page_url || '-').trim();
    const referrer = String(data.referrer || '-').trim();
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });

    // Формирование сообщения для Telegram
    let message = "🔔 <b>Новая заявка с сайта BBC</b>\n\n";
    message += `👤 <b>Имя:</b> ${name}\n`;
    message += `📱 <b>Телефон:</b> ${phone}\n`;
    message += `🕐 <b>Время:</b> ${timestamp}\n\n`;

    message += "📋 <b>Данные из квиза:</b>\n";
    message += `├ Сотрудников: ${employees}\n`;
    message += `├ Оборот: ${turnover}\n`;
    message += `├ Услуги: ${services}\n`;
    message += `└ Проблемы: ${problems}\n\n`;

    message += "📊 <b>UTM-метки:</b>\n";
    message += `├ Source: ${utm_source}\n`;
    message += `├ Medium: ${utm_medium}\n`;
    message += `├ Campaign: ${utm_campaign}\n`;
    message += `├ Term: ${utm_term}\n`;
    message += `└ Content: ${utm_content}\n\n`;

    message += "🌐 <b>Дополнительно:</b>\n";
    message += `├ Страница: ${page_url}\n`;
    message += `└ Источник перехода: ${referrer}\n`;

    // Отправка сообщения в Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram API error:', telegramData);
      res.status(500).json({
        success: false,
        message: 'Ошибка отправки заявки'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Заявка успешно отправлена!'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
}
