export const SPOTIFY_SCOPES = {
  connect: [
    'user-read-playback-state', // Permite acceder al estado de reproducción.
    'user-modify-playback-state' // Permite controlar la reproducción.
  ],
  playback: [
    'streaming', // Permite la reproducción de una canción.
  ],
  playlists: [
    'playlist-read-private', // Permite acceder a listas de reproducción privadas del usuario.
  ],
  history: [
    'user-read-recently-played', // Permite ver las canciones reproducidas recientemente por el usuario.
  ],
  users: [
    'user-read-email', // Permite acceder a la dirección de correo electrónico del usuario.
    'user-read-private', // Permite leer información privada del perfil del usuario.
  ],
};

// Exporta los scopes como un string separado por espacios
export const SPOTIFY_SCOPES_STRING = [
  ...SPOTIFY_SCOPES.connect,
  ...SPOTIFY_SCOPES.playback,
  ...SPOTIFY_SCOPES.playlists,
  ...SPOTIFY_SCOPES.history,
  ...SPOTIFY_SCOPES.users,
].join(' ');
