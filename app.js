let videoList = []; // Lista de videos
let currentVideoIndex = 0; // Índice del video actual

// Función para cargar las listas desde el JSON
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

// Función para seleccionar aleatoriamente una lista y cargarla
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

// Función para procesar una lista M3U
function parseM3U(content) {
    const lines = content.split('\n');
    return lines.filter(line => line.trim() && !line.startsWith('#'));
}

// Función para reproducir el siguiente video
function playNextVideo() {
    if (videoList.length === 0) {
        console.warn('No hay videos disponibles para reproducir.');
        return;
    }

    const videoPlayer = document.getElementById('video');
    videoPlayer.src = videoList[currentVideoIndex];
    videoPlayer.play();

    // Incrementar el índice del video para el próximo
    currentVideoIndex = (currentVideoIndex + 1) % videoList.length;

    // Reproducir automáticamente el siguiente video al finalizar el actual
    videoPlayer.onended = playNextVideo;
}

// Iniciar la carga de listas al abrir la página
loadPlaylists();
