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
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        overlay.style.opacity = '0';

        document.getElementById('container').style.filter = 'none';

    } else {
        settingsPanel.style.display = 'grid';
        settingsPanel.style.opacity = '1';
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