document.getElementById('loadButton').addEventListener('click', loadM3U);
document.getElementById('randomButton').addEventListener('click', playRandomVideo);

let videoList = [];

function loadM3U() {
    const input = document.getElementById('m3uInput');
    const file = input.files[0];
    if (!file) {
        alert('Por favor selecciona un archivo M3U.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const content = event.target.result;
        videoList = parseM3U(content);
        displayVideoList();
    };
    reader.readAsText(file);
}

function parseM3U(content) {
    const lines = content.split('\n');
    const videos = [];
    lines.forEach((line) => {
        if (line.trim() && !line.startsWith('#')) {
            videos.push(line.trim());
        }
    });
    return videos;
}

function displayVideoList() {
    const listDiv = document.getElementById('videoList');
    listDiv.innerHTML = '';
    videoList.forEach((video, index) => {
        const div = document.createElement('div');
        div.textContent = `Video ${index + 1}: ${video}`;
        listDiv.appendChild(div);
    });
}

function playRandomVideo() {
    if (videoList.length === 0) {
        alert('No hay videos cargados.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * videoList.length);
    const videoPlayer = document.getElementById('video');
    videoPlayer.src = videoList[randomIndex];
    videoPlayer.play();
}
