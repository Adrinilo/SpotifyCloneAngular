import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SPOTIFY_SCOPES_STRING } from '../constants/spotify-scopes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private clientId = environment.clientId;
  private redirectUri = 'http://localhost:4200/callback';
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private responseType = 'token';
  private scope = SPOTIFY_SCOPES_STRING;

  // Comprueba si el token de acceso existe y es válido
  isLoggedIn(): boolean {
    const token = localStorage.getItem('spotify_access_token');
    return !!token;
  }

  public login() {
    let authUrl = `${this.authEndpoint}?client_id=${this.clientId}&response_type=${this.responseType}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scope)}`;

    window.location.href = authUrl;
  }
  
  public logout() {
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/login';
  }

  public getAccessToken(): string | null {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      return params.get('access_token');
    }
    return null;
  }
}
