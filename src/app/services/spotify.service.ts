import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private accessToken = localStorage.getItem('spotify_access_token');
  //private userId = localStorage.getItem('user_id');
  private apiUrl = 'https://api.spotify.com/v1/';

  constructor(private authService: AuthService, private http: HttpClient) {}

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
    try {
      const response = await fetch(
        this.apiUrl + 'me/playlists?limit=' + limit,
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
      const response = await fetch(
        this.apiUrl + 'tracks/' + trackId,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener la cancion:', error);
      throw error;
    }
  }

  public async getPlaybackState() {
    const response = await fetch(this.apiUrl + 'me/player', {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return await response.json();
  }

  // Pausar reproducción
  pausePlayback(): void {
    this.http
      .put(
        `${this.apiUrl}me/player/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .subscribe({
        next: () => console.log('Playback paused'),
        error: (err: any) => console.error('Error pausing playback:', err +'\n' + err.error.error.message),
      });
  }

  // Reanudar reproducción
  resumePlayback(): void {
    this.http
      .put(
        `${this.apiUrl}me/player/play`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
      .subscribe({
        next: () => console.log('Playback resumed'),
        error: (err: any) => console.error('Error resuming playback:', err +'\n' + err.error.error.message),
      });
  }
}
