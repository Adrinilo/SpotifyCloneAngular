import { Component, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Track } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { Album } from '../../interfaces/album.interface';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrl: './tracks.component.css',
})
export class TracksComponent {
  tracks: Track[] = [];

  constructor(
    private datosService: DatosService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    this.datosService.datoActual.subscribe((dato) => {
      this.getTracks(dato);
    });
  }

  getTracks(playlistId: string) {
    this.spotifyService
      .getTracksPlaylists(playlistId)
      .then((data) => {
        this.tracks = this.formatTracks(data.items);
      })
      .catch((error) => {
        console.error('Error fetching playlists:', error);
      });
  }

  formatTracks(items: any[]): Track[] {
    return items.map((item: any) => {
      let tracks: Track = {
        id: item.track.id,
        name: item.track.name,
        album: item.track.album as Album,
        artists: item.track.artists,
        external_urls: item.track.external_urls.spotify ? item.track.external_urls.spotify : '',
      };
      return tracks;
    });
  }
}
