let darkmode = localStorage.getItem('darkmode');

if (darkmode === 'enabled') {
    document.body.classList.add('darkmode');
}
else {
    document.body.classList.remove('darkmode');
}

document.getElementById('modebtn').addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    
    if (darkmode !== 'enabled') {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkmode', 'enabled');
    }
    else {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkmode', 'disabled');
    }
});


const settingsBtn = document.querySelector('.nav.btn.b5');
const settingsPanel = document.getElementById('settings');
const overlay = document.getElementById('overlay');

settingsBtn.addEventListener('click', () => {
    if (settingsPanel.style.display === 'grid') {
        settingsPanel.style.display = 'none';
        settingsPanel.style.opacity = '0';
        settingsPanel.style.zIndex = '-10';
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';

        document.getElementById('container').style.filter = 'none';

    } else {
        settingsPanel.style.display = 'grid';
        settingsPanel.style.opacity = '1';
        settingsPanel.style.zIndex = '10';
        overlay.style.display = 'block';
        overlay.style.pointerEvents = 'auto';
        overlay.style.opacity = '1';

        document.getElementById('container').style.filter = 'blur(5px)';
    }
});

document.getElementById('saveSettings').addEventListener('click', () => {
    settingsPanel.style.display = 'none';
    settingsPanel.style.opacity = '0';
    overlay.style.display = 'none';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';

    document.getElementById('container').style.filter = 'none';
})



const dashbtn = document.getElementById('dashbtn');
const slider = dashbtn.querySelector('.slider');

let active = 'Client';

dashbtn.addEventListener('click', (e) => {
    const rect = dashbtn.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX < rect.width / 2 && active !== 'Client') {
        slider.style.transform = 'translateX(0%)';
        active = 'Client';
        document.querySelector('#host').style.display = 'none';
        document.querySelector('#client').style.display = 'grid';
        dashbtn.classList.add('active');

    } else if (clickX >= rect.width / 2 && active !== 'Server') {

        slider.style.transform = 'translateX(100%)';
        active = 'Server';
        document.querySelector('#host').style.display = 'grid';
        document.querySelector('#client').style.display = 'none';
        dashbtn.classList.remove('active');
    }
});


document.querySelectorAll('.localIp').forEach((element) => {
    if (element.classList.contains('blurrable')) {
        element.addEventListener('click', () => {
            if (element.style.filter === 'none') {
                element.style.filter = 'blur(0.3rem)';
            } else {
                element.style.filter = 'none';
            }
        });
    }
});


function updateConnectionStatus() {
    fetch("/status")
    .then(res => res.json())
    .then(data => {
        const ipElements = document.querySelectorAll(".localIp");
        ipElements.forEach(el => el.textContent = data.ip);


        if (data.ip === "Connection error") {
            toast('Connection Error',"Missing internet connection.",0,5200)
            document.getElementById('dashboard').style.opacity = '0'
            ipElements.forEach(element => {
                element.classList.add('no-blur')
                element.classList.remove('blurrable')
            });
        } else {
            if (document.getElementById('dashboard').style.opacity =='0') {
                ipElements.forEach(element => {
                    element.classList.remove('no-blur')
                    element.classList.add('blurrable')
                });
                toast('Info' , "Welcome to A32NX Crewbridge!",2,4000)
                document.getElementById('dashboard').style.opacity = '1'
            }
        }
    })
    .catch(err => {
        console.error("Status check failed:", err);
        toast("Connection Error", "Could not reach the backend.", 0, 4500);
    });
}

setInterval(updateConnectionStatus, 5000);

document.addEventListener("DOMContentLoaded", () => {
    updateConnectionStatus();
});





const TOAST_ICONS = {
    error: `
        <svg viewBox="0 0 24 24" fill="#ff3b30">
            <circle cx="12" cy="12" r="11" stroke="#ff3b30" stroke-width="2" fill="none"/>
            <line x1="8" y1="8" x2="16" y2="16" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/>
            <line x1="16" y1="8" x2="8" y2="16" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    warn: `
        <svg viewBox="0 0 24 24" fill="#ffcc00">
            <polygon points="12,2 2,22 22,22" stroke="#ffcc00" stroke-width="2" fill="none"/>
            <line x1="12" y1="10" x2="12" y2="14" stroke="#ffcc00" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="17" r="1" stroke="#ffcc00" fill="#ffcc00"/>
        </svg>
    `,
    info: `
        <svg viewBox="0 0 24 24" fill="#007aff">
            <circle cx="12" cy="12" r="11" stroke="#007aff" stroke-width="2" fill="none"/>
            <line x1="12" y1="10" x2="12" y2="17" stroke="#007aff" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="6" r="0.75" stroke="#007aff" fill="#007aff"/>
        </svg>
    `
};



function toast(title, text, level = 2, time = 3000) {
    const toastEl = document.getElementById('toast');
    const titleEl = toastEl.querySelector('h6');
    const textEl = toastEl.querySelector('a');
    const iconEl = toastEl.querySelector('.icon');

    titleEl.textContent = title;
    textEl.textContent = text;

    toastEl.classList.remove("terr", "twarn", "tinfo");

    if (level === 0) {
        toastEl.classList.add("terr");
        iconEl.innerHTML = TOAST_ICONS.error;
    } else if (level === 1) {
        toastEl.classList.add("twarn");
        iconEl.innerHTML = TOAST_ICONS.warn;
    } else {
        toastEl.classList.add("tinfo");
        iconEl.innerHTML = TOAST_ICONS.info;
    }

    toastEl.classList.add('show');
    if (toastEl.hideTimeout) clearTimeout(toastEl.hideTimeout);

    toastEl.hideTimeout = setTimeout(() => {
        toastEl.classList.remove('show');
    }, time);
}
