import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private accessToken = localStorage.getItem('spotify_access_token');
  //private userId = localStorage.getItem('user_id');
  private apiUrl = 'https://api.spotify.com/v1/';

  constructor(private authService: AuthService) {}

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

  public async getTracksPlaylists(playlistId: string) {
    const response = await fetch(
      this.apiUrl + 'playlists/' + playlistId + '/tracks',
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    return await response.json();
  }
}
