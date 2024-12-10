const playlistContainer = document.getElementById('playlistContainer');
const randomButton = document.getElementById('randomButton');
const videoPlayer = document.getElementById('video');
const videoListContainer = document.getElementById('videoList');

let videoList = [];

// Cargar las listas M3U del archivo JSON
async function loadPlaylists() {
    try {
        const response = await fetch('playlists.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON.');
        }
        const data = await response.json();
        displayPlaylists(data.playlists);
    } catch (error) {
        console.error('Error al cargar las listas:', error);
        alert('No se pudieron cargar las listas. Revisa el archivo JSON.');
    }
}

// Mostrar las listas en la interfaz
function displayPlaylists(playlists) {
    playlistContainer.innerHTML = '';
    playlists.forEach((playlist, index) => {
        const button = document.createElement('button');
        button.textContent = playlist.name;
        button.addEventListener('click', () => loadM3U(playlist.url));
        playlistContainer.appendChild(button);
    });
}

// Cargar y procesar una lista M3U desde una URL
async function loadM3U(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar la lista M3U: ${response.statusText}`);
        }

        const content = await response.text();
        videoList = parseM3U(content);

        if (videoList.length === 0) {
            alert('No se encontraron videos en la lista.');
            return;
        }

        randomButton.disabled = false;
        displayVideoList();
    } catch (error) {
        console.error('Error al cargar la lista M3U:', error);
        alert('Hubo un problema al cargar la lista M3U. Verifica la URL.');
    }
}

// Parsear el contenido de la lista M3U
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

// Mostrar la lista de videos
function displayVideoList() {
    videoListContainer.innerHTML = '';
    videoList.forEach((video, index) => {
        const div = document.createElement('div');
        div.textContent = `Video ${index + 1}: ${video}`;
        div.addEventListener('click', () => playVideo(video));
        div.style.cursor = 'pointer';
        div.style.marginBottom = '0.5rem';
        videoListContainer.appendChild(div);
    });
}

// Reproducir un video aleatorio
randomButton.addEventListener('click', () => {
    if (videoList.length === 0) {
        alert('No hay videos cargados.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * videoList.length);
    playVideo(videoList[randomIndex]);
});

// Reproducir un video seleccionado
function playVideo(url) {
    videoPlayer.src = url;
    videoPlayer.play();
}

// Cargar las listas al inicio
loadPlaylists();
