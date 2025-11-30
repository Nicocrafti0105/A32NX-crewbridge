import express from 'express';
import WinReg from 'winreg';
import os from 'os';

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

function detectLocalIp() {
    const nets = os.networkInterfaces();
    for (const name in nets) {
        for (const net of nets[name]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
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
    const regKey = new WinReg({
        hive: WinReg.HKLM,
        key: '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Microsoft.FlightSimulator'
    });

    regKey.get('DisplayVersion', (err, item) => {
        if (err) {
            console.error('Error reading registry:', err.message);
        } else {
            mfsVersion = item.value;
            console.log('MSFS Version:', mfsVersion);
        }
    });
} else {
    mfsVersion = "Unsupported OS";
}


let currentStatus = {
    ip: detectLocalIp(),
    timestamp: Date.now()
};

setInterval(() => {
    currentStatus.ip = detectLocalIp();
    currentStatus.timestamp = Date.now();
    console.log("Updated IP:", currentStatus.ip);
}, 5000);

app.get('/', (req,res) => {
    res.render('index', {
        hostname,
        localip: currentStatus.ip,
        mfsVersion
    });
});


app.get("/status", (req, res) => {
    res.json(currentStatus);
});
