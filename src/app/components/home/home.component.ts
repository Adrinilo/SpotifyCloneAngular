import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Playlist } from '../../interfaces/playlist.interface';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any;
  playlists: Playlist[] = [];
  //recentlyPlayed: Playlist[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private authService: AuthService,
    private formatService: FormatService,
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
          this.playlists = this.formatService.formatPlaylists(data.items).slice(0,8);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
        /*this.spotifyService
        .getRecentlyPlayed()
        .then((data) => {
          this.recentlyPlayed = data.items;
          //console.log(this.recentlyPlayed);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });*/
    }
    this.authService.isLoggedIn()
      ? '' // Si está logueado no hacemos nada
      : this.router.navigate(['/login']); // Si no está logueado redirigimos a login
  }

  playlistDetails(id: string) {
    this.router.navigate(['/playlist', id]);
  }
}
