import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Playlist } from '../../interfaces/playlist.interface';
import { DatosService } from '../../services/datos.service';
import { Router } from '@angular/router';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.css',
})
export class PlaylistsComponent {
  result: any;
  playlists: Playlist[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private formatService: FormatService,
    private datosService: DatosService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.spotifyService
        .getUserPlaylists()
        .then((data) => {
          this.result = data;
          this.playlists = this.formatService.formatPlaylists(data.items);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    }
  }

  enviarDato(playlistId: string) {
    this.datosService.enviarDato(playlistId);
    this.router.navigate(['playlists', 'tracks']);
  }
}
