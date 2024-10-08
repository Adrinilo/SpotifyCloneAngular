import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private accessToken = localStorage.getItem('spotify_access_token');
  private userId = localStorage.getItem('user_id');

  private apiUrl = 'https://api.spotify.com/v1/';

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
    const response = await fetch(this.apiUrl + 'me/playlists?limit=' + limit, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return await response.json();
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
