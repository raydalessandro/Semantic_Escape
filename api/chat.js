// ============================================
// VERCEL SERVERLESS FUNCTION - DeepSeek API Proxy
// ============================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, model, max_tokens, temperature } = req.body;

        // Validazione input
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        // Chiama DeepSeek API
        const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: model || 'deepseek-chat',
                messages: messages,
                max_tokens: max_tokens || 2048,
                temperature: temperature || 0.7,
                stream: false
            })
        });

        if (!deepseekResponse.ok) {
            const errorData = await deepseekResponse.json();
            console.error('DeepSeek API Error:', errorData);
            return res.status(deepseekResponse.status).json({
                error: errorData.error?.message || 'DeepSeek API error'
            });
        }

        const data = await deepseekResponse.json();

        // Estrai messaggio dalla risposta
        const message = data.choices?.[0]?.message?.content || 'Errore: risposta vuota';

        // Ritorna risposta
        return res.status(200).json({
            success: true,
            message: message,
            usage: data.usage // Info su token usati
        });

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
