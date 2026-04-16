const { requireRole } = require('../auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin only
  const authResult = requireRole(req, ['admin']);
  if (!authResult.authorized) {
    return res.status(403).json({ error: authResult.error });
  }

  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3457',
        'X-Title': 'Avis Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Nettoyer le JSON (enlever les backticks markdown)
    const cleanContent = content.replace(/```json|```/g, '').trim();
    
    try {
      const reviews = JSON.parse(cleanContent);
      return res.status(200).json(reviews);
    } catch (e) {
      throw new Error('Invalid JSON response: ' + cleanContent.slice(0, 200));
    }
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
