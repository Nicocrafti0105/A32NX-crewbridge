import express from 'express';
import WinReg from 'winreg';
import os from 'os';
import https from 'https';
import { exec } from "child_process";

async function detectMSFSVersion(path) {
    return new Promise((resolve) => {
        const ps = `
        $paths = @(
            ${new String(path)}
        )

        $appx = Get-AppxPackage -Name "*flight*" | Select-Object -First 1
        if ($appx) {
            $paths += (Join-Path $appx.InstallLocation "FlightSimulator.exe")
        }

        foreach ($p in $paths) {
            if (Test-Path $p) {
                (Get-Item $p).VersionInfo.FileVersion
                exit
            }
        }

        "Not installed"
        `;

        exec(`powershell -command "${ps}"`, (err, stdout) => {
            if (err) return resolve("Unknown");
            resolve(stdout.trim());
        });
    });
}



const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

async function detectLocalIp(type = "lan") {
    const nets = os.networkInterfaces();

    if (type === "lan") {
        for (const name in nets) {
            for (const net of nets[name]) {
                if (net.family === "IPv4" && !net.internal && !net.address.startsWith("100.")) {
                    return (net.address + '/lan');
                }
            }
        }
    }

    if (type === "tailscale") {
        for (const name in nets) {
            for (const net of nets[name]) {
                if (net.family === "IPv4" && !net.internal && net.address.startsWith("100.")) {
                    return (net.address + '/tailscale');
                }
            }
        }
    }

    
    if (type === "net") {
        return new Promise((resolve, reject) => {
            https.get("https://api.ipify.org", (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => resolve(data + "/net"));
            }).on("error", err => reject({ ip: "Connection error", type }));
        });
    }

    return "Connection error";
}

const portIndex = process.argv.indexOf("--port");
const port = portIndex !== -1 ? process.argv[portIndex + 1] : 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const hostname = os.hostname();
const platform = os.platform();
let mfsVersion = "Unknown";


if (platform === "win32") {
    mfsVersion = await detectMSFSVersion()
} else {
    mfsVersion = "Unsupported OS";
}



let currentStatus = {
    ip: await detectLocalIp(),
    timestamp: Date.now()
};

setInterval(async () => {
    currentStatus.ip = await detectLocalIp("net");
    currentStatus.timestamp = Date.now();
}, 5000);


app.get('/', (req,res) => {
    res.render('index', {
        hostname,
        localip: currentStatus.ip,
        mfsVersion,
    });
});


app.get("/status", (req, res) => {
    res.json(currentStatus);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/connect', (req, res) => {
    console.log('Received /connect form data:', req.body);
    res.sendStatus(200);
});