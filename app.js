let videoList = []; // Lista completa de videos
let currentVideoIndex = 0; // Índice del video actual

// Cargar el archivo JSON con las listas
async function loadPlaylists() {
    try {
        const response = await fetch('playlists.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON.');
        }
        const data = await response.json();
        await loadRandomPlaylist(data.playlists);
    } catch (error) {
        console.error('Error al cargar las listas:', error);
    }
}

// Seleccionar aleatoriamente una lista M3U y cargarla
async function loadRandomPlaylist(playlists) {
    const randomIndex = Math.floor(Math.random() * playlists.length);
    const playlistUrl = playlists[randomIndex].url;

    try {
        const response = await fetch(playlistUrl);
        if (!response.ok) {
            throw new Error(`Error al cargar la lista M3U: ${response.statusText}`);
        }

        const content = await response.text();
        videoList = parseM3U(content);

        if (videoList.length === 0) {
            console.warn('No se encontraron videos en la lista seleccionada.');
            return;
        }

        playNextVideo();
    } catch (error) {
        console.error('Error al cargar la lista M3U:', error);
    }
}

// Parsear el contenido de una lista M3U
function parseM3U(content) {
    const lines = content.split('\n');
    return lines.filter(line => line.trim() && !line.startsWith('#'));
}

// Reproducir el siguiente video de la lista
function playNextVideo() {
    if (videoList.length === 0) {
        console.warn('No hay videos disponibles para reproducir.');
        return;
    }

    const videoPlayer = document.getElementById('video');
    videoPlayer.src = videoList[currentVideoIndex];
    videoPlayer.play();

    // Incrementar el índice para el próximo video
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;

    // Configurar el evento para reproducir automáticamente el próximo video
    videoPlayer.onended = playNextVideo;
}

// Iniciar la carga de las listas al abrir la página
loadPlaylists();
