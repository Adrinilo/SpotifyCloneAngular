import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../interfaces/track.interface';

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private accessToken = localStorage.getItem('spotify_access_token');
  //private userId = localStorage.getItem('user_id');
  private apiUrl = 'https://api.spotify.com/v1/';
  private player: any;
  private sdkReady: Promise<void>;
  private deviceId: string | null = null;

  /*private playerState = new BehaviorSubject<any>(null);
  playerState$ = this.playerState.asObservable();*/

  private currentTrackSubject = new BehaviorSubject<any>({} as Track);
  currentTrack$ = this.currentTrackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  constructor(private authService: AuthService) {
    this.sdkReady = new Promise((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(); // El SDK está listo para usarse
      };
    });
  }

  public async getUserProfile() {
    const response = await fetch(this.apiUrl + 'me', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return await response.json();
  }

  public async getUserId() {
    const response = await fetch(this.apiUrl + 'me', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const data = await response.json();
    return data.id;
  }

  public async getUserById(userId: string) {
    try {
      const response = await fetch(this.apiUrl + 'users/' + userId, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.authService.logout();
        } else if (response.status === 400) {
          window.location.href = '/';
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }

  public async getUserPlaylists() {
    const limit = 50;
    const offset = 0;
    try {
      const response = await fetch(
        this.apiUrl + `me/playlists?limit=${limit}&${offset}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      // Verificamos la respuesta
      if (!response.ok) {
        // Si el error es 401 (Unauthorized), llamamos a logout()
        // ya que el token ha expirado
        if (response.status === 401) {
          this.authService.logout();
        }
        // Lanzamos un error para manejar otros posibles errores
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Si la respuesta es correcta devolvemos los datos obtenidos
      return await response.json();
    } catch (error) {
      // En caso de cualquier error, lo manejamos aquí
      console.error('Error al obtener las playlists:', error);
      throw error;
    }
  }

  public async getPlaylistsId(playlistId: string) {
    try {
      const response = await fetch(this.apiUrl + 'playlists/' + playlistId, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.authService.logout();
        } else if (response.status === 400) {
          window.location.href = '/';
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener la playlist:', error);
      throw error;
    }
  }

  public async getRecentlyPlayed() {
    try {
      const response = await fetch(
        this.apiUrl + 'me/player/recently-played?limit=8',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          this.authService.logout();
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener las pistas recientes:', error);
      throw error;
    }
  }

  public async getTracksPlaylists(playlistId: string) {
    try {
      const response = await fetch(
        this.apiUrl + 'playlists/' + playlistId + '/tracks',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 400) {
          window.location.href = '/';
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener los tracks de la playlist:', error);
      throw error;
    }
  }

  public async getTrackById(trackId: string) {
    try {
      const response = await fetch(this.apiUrl + 'tracks/' + trackId, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener la cancion:', error);
      throw error;
    }
  }

  /*public async getPlaybackState(): Promise<void> {
    try {
      const response = await fetch(this.apiUrl + 'me/player', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error al obtener el estado del reproductor:', error);
      throw error;
    }
  }*/

  public async initializePlayer(): Promise<void> {
    if (!this.accessToken) {
      console.error(
        'No se puede inicializar el reproductor: falta el token de acceso.'
      );
      return;
    }

    try {
      // Espera a que el SDK esté listo
      await this.sdkReady;

      // Crear el reproductor
      this.createPlayer();

      // Configurar listeners
      this.addListeners();

      // Conectar el reproductor
      this.connectPlayer();
    } catch (error) {
      console.error('Error al inicializar el reproductor:', error);
    }
  }

  private createPlayer(): void {
    this.player = new window.Spotify.Player({
      name: 'Angular Spotify Player',
      getOAuthToken: (cb: (token: string) => void) =>
        this.accessToken
          ? cb(this.accessToken)
          : console.error('No se pudo proporcionar el token de acceso.'),
    });
  }

  private async connectPlayer(): Promise<void> {
    const connected = await this.player?.connect();
    if (connected) {
      console.log('Reproductor conectado exitosamente.');
    } else {
      console.error('Error al conectar el reproductor.');
    }
  }

  isPlaying(): boolean {
    return this.player?.is_playing;
  }

  //Reproduce una canción
  playTrack(trackUri: string): void {
    if (!this.accessToken && !this.deviceId) {
      console.error('El dispositivo no está listo.');
      return;
    }

    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log('Reproducción iniciada.');
        } else {
          console.error('Error al iniciar la reproducción:', response);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de reproducción:', error);
      });
  }

  //Pausa una canción
  pauseTrack(): void {
    if (!this.accessToken && !this.deviceId) {
      console.error('El dispositivo no está listo.');
      return;
    }

    fetch(
      `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log('Reproducción pausada.');
        } else {
          console.error('Error al pausar la reproducción:', response);
        }
      })
      .catch((error) => {
        console.error('Error al realizar la solicitud de reproducción:', error);
      });
  }

  private addListeners(): void {
    // Listener: Cuando el reproductor está listo
    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      this.deviceId = device_id;
      console.log('Reproductor listo con ID:', device_id);
    });

    // Listener: Cuando el reproductor no está listo
    this.player.addListener(
      'not_ready',
      ({ device_id }: { device_id: string }) => {
        console.error('El reproductor no está listo con ID:', device_id);
      }
    );

    // Listener: Cambios en el estado del reproductor
    this.player.addListener('player_state_changed', (state: any) => {
      console.log('Estado del reproductor:', state);
      if (!state) return;

        const { current_track } = state.track_window;
        this.currentTrackSubject.next(current_track);
        this.isPlayingSubject.next(!state.paused);
    });

    // Listener: Errores de reproducción
    this.player.addListener(
      'initialization_error',
      ({ message }: { message: string }) => {
        console.error('Error de inicialización:', message);
      }
    );

    this.player.addListener(
      'authentication_error',
      ({ message }: { message: string }) => {
        console.error('Error de autenticación:', message);
      }
    );

    this.player.addListener(
      'account_error',
      ({ message }: { message: string }) => {
        console.error('Error de cuenta:', message);
      }
    );

    this.player.addListener(
      'playback_error',
      ({ message }: { message: string }) => {
        console.error('Error de reproducción:', message);
      }
    );
  }
}
