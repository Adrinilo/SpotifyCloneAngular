export const SPOTIFY_SCOPES = {
  userProfile: [
    'user-read-private', // Permite leer información privada del perfil del usuario.
    'user-read-email', // Permite acceder a la dirección de correo electrónico del usuario.
  ],
  playback: [
    'user-read-playback-state', // Permite acceder al estado de reproducción del usuario.
    'user-read-recently-played', // Permite ver las canciones reproducidas recientemente por el usuario.
    'user-modify-playback-state' // Permite controlar la reproducción del usuario.
  ],
  playlists: [
    'playlist-read-private', // Permite acceder a listas de reproducción privadas del usuario.
  ],
};

// Exporta los scopes como un string separado por espacios
export const SPOTIFY_SCOPES_STRING = [
  ...SPOTIFY_SCOPES.userProfile,
  ...SPOTIFY_SCOPES.playback,
  ...SPOTIFY_SCOPES.playlists,
].join(' ');
