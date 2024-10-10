import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Playlist } from '../../interfaces/playlist.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any;
  playlists: Playlist[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.spotifyService
        .getUserProfile()
        .then((data) => {
          this.user = data;
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
        });
      this.spotifyService
        .getUserPlaylists()
        .then((data) => {
          this.playlists = this.formatPlaylists(data.items);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    }
    this.authService.isLoggedIn()
      ? '' // Si está logueado no hacemos nada
      : this.router.navigate(['/login']); // Si no está logueado redirigimos a login
  }

  formatPlaylists(items: any[]): Playlist[] {
    items = items.slice(0,8);
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
        external_urls: item.external_urls.spotify,
        type: item.type == 'playlist' ? 'Lista' : item.type,
        owner_name: item.owner.display_name
      };
      return playlist;
    });
  }
}
