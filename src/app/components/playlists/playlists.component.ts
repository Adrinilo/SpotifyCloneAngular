import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Playlist } from '../../interfaces/playlist.interface';
import { DatosService } from '../../services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css',
})
export class PlaylistsComponent {
  result: any;
  playlists: Playlist[] = [];

  constructor(private spotifyService: SpotifyService, private datosService: DatosService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.spotifyService
        .getUserPlaylists()
        .then((data) => {
          this.result = data;
          this.playlists = this.formatPlaylists(data.items);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    }
  }

  formatPlaylists(items: any[]): Playlist[] {
    return items.map((item: any) => {
      let playlist: Playlist = {
        id: item.id,
        name: item.name,
        description: item.description,
        href: item.href,
        images: item.images ? item.images.map((img: any) => img.url) : [],
        tracks: item.tracks ? item.tracks.total : 0,
        public: item.public,
        uri: item.uri,
        external_urls: item.external_urls.spotify
      };
      return playlist;
    });
  }

  enviarDato(playlistId: string) {
    this.datosService.enviarDato(playlistId);
    this.router.navigate(['playlists', 'tracks']);
  }
}
