import { Injectable } from '@angular/core';
import { Playlist } from '../interfaces/playlist.interface';
import { Track } from '../interfaces/track.interface';
import { Album } from '../interfaces/album.interface';
import { Artist } from '../interfaces/artist.interface';
import { User } from '../interfaces/user.interface';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  constructor(private spotifyService: SpotifyService) {}

  public formatPlaylists(items: any[]): Playlist[] {
    return items.map((item: any) => {
      return this.formatPlaylistItem(item);
    });
  }

  public formatPlaylistItem(item: any): Playlist {
    //const owner = await this.formatOwner(item.owner.id); // Espera a que se resuelva el owner
    let playlist: Playlist = {
      id: item.id,
      description: item.description,
      external_urls: item.external_urls.spotify,
      followers: item.followers ? item.followers.total : 0,
      href: item.href,
      images: item.images ? item.images.map((img: any) => img.url) : [],
      name: item.name,
      owner: this.formatUser(item.owner),
      public: item.public == true ? 'pública' : 'privada',
      tracks_total: item.tracks.total ? item.tracks.total : 0,
      tracks: item.tracks.items ? this.formatTracks(item.tracks.items) : [],
      type: item.type == 'playlist' ? 'Lista' : item.type,
      uri: item.uri,
      duration: item.tracks.items
        ? this.formatDuration(item.tracks.items, item.tracks.total)
        : '0',
    };
    return playlist;
  }

  public formatTracks(items: any[]): Track[] {
    return items.map((item: any) => {
      let tracks: Track = {
        id: item.track.id,
        name: item.track.name,
        album: this.formatAlbum(item.track.album),
        artists: item.track.artists as Artist[],
        external_urls: item.track.external_urls.spotify
          ? item.track.external_urls.spotify
          : '',
        preview_url: item.preview_url,
      };
      return tracks;
    });
  }

  public formatTrackPlaying(item: any): Track {
    let track: Track = {
      id: item.id,
      name: item.name,
      album: this.formatAlbum(item.album),
      artists: item.artists as Artist[],
      external_urls: item.external_urls.spotify
        ? item.external_urls.spotify
        : '',
      preview_url: item.preview_url,
    };
    return track;
  }

  public formatAlbum(item: any): Album {
    let album: Album = {
      id: item.id,
      name: item.name,
      total_tracks: item.total_tracks,
      external_urls: item.external_urls.spotify
        ? item.external_urls.spotify
        : '',
      release_date: item.release_date,
      images: item.images ? item.images.map((img: any) => img.url) : [],
      artists: item.artists as Artist[],
    };
    return album;
  }

  private formatUser(item: any): User {
    let user: User = {
      id: item.id,
      name: item.display_name ? item.display_name : '',
      external_urls: item.external_urls.spotify
        ? item.external_urls.spotify
        : '',
      //images: item.images ? item.images.map((img: any) => img.url) : [],
    };
    return user;
  }

  private async formatOwner(userId: string): Promise<User> {
    const owner = await this.spotifyService.getUserById(userId);
    return this.formatUser(owner);
  }

  private formatDuration(items: any, total: number): string {
    let durationMs = 0;
    if (total > 50) {
      // Una canción de media dura más de 3 min
      // Vamos a suponer que cada cancion son 205 segundos de media
      // 205seg -> readondeamos a 205000ms
      // Con esta media por canción multiplicamos por el total
      durationMs = 205000 * total;
      return this.durationStr(durationMs) + ' aproximadamente';
    } else {
      items.map((item: any) => {
        durationMs += item.track.duration_ms;
      });
      return this.durationStr(durationMs);
    }
  }

  private durationStr(durationMs: number): string {
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0 && minutes > 0) {
      return `${hours} h ${minutes} min`;
    } else if (hours > 0 && minutes <= 0) {
      return `${hours} h`;
    } else {
      return `${minutes} min`;
    }
  }
}
