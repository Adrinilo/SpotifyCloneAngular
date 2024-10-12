import { Injectable } from '@angular/core';
import { Playlist } from '../interfaces/playlist.interface';
import { Track } from '../interfaces/track.interface';
import { Album } from '../interfaces/album.interface';
import { Artist } from '../interfaces/artist.interface';
import { Owner } from '../interfaces/owner.interface';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  constructor() {}

  public formatPlaylists(items: any[]): Playlist[] {
    return items.map((item: any) => {
      return this.formatPlaylistItem(item);
    });
  }

  public formatPlaylistItem(item: any): Playlist {
    let playlist: Playlist = {
      id: item.id,
      description: item.description,
      external_urls: item.external_urls.spotify,
      followers: item.followers ? item.followers.total : 0,
      href: item.href,
      images: item.images ? item.images.map((img: any) => img.url) : [],
      name: item.name,
      owner: this.formatOwner(item.owner),
      public: item.public == true ? 'pública' : 'privada',
      tracks_total: item.tracks.total ? item.tracks.total : 0,
      tracks: item.tracks.items ? this.formatTracks(item.tracks.items) : [],
      type: item.type == 'playlist' ? 'Lista' : item.type,
      uri: item.uri,
      duration: item.tracks.items ? this.formatDuration(item.tracks.items, item.tracks.total) : '0',
    };
    return playlist;
  }

  formatTracks(items: any[]): Track[] {
    return items.map((item: any) => {
      let tracks: Track = {
        id: item.track.id,
        name: item.track.name,
        album: item.track.album as Album,
        artists: item.track.artists as Artist[],
        external_urls: item.track.external_urls.spotify
          ? item.track.external_urls.spotify
          : '',
      };
      return tracks;
    });
  }

  private formatOwner(item: any): Owner {
    let owner: Owner = {
      external_urls: item.external_urls.spotify,
      id: item.id,
      name: item.display_name ? item.display_name : '',
    };
    return owner;
  }

  private formatDuration(items: any, total: number): string {    
    let durationMs = 0;
    if (total>50) {
      // Una canción de media dura más de 3 min
      // Vamos a suponer que cada cancion son 205 segundos de media
      // 205ms -> readondeamos a 205000ms
      // Con esta media por canción multiplicamos por el total
      durationMs = 205000 * total;
    } else {
      items.map((item: any) => {
        durationMs += item.track.duration_ms;
      })
    }
    
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0 && minutes > 0) {
      return `${hours} h ${minutes} m`;
    } else if (hours > 0 && minutes <= 0) {
      return `${hours} h`;
    } else {
      return `${minutes} m`;
    }
  }
}
