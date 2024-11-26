import { Component, OnInit } from '@angular/core';
import { Track } from '../../interfaces/track.interface';
import { SpotifyService } from '../../services/spotify.service';
import { FormatService } from '../../services/format.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent implements OnInit {
  track!: Track;
  isPlaying: boolean = false;

  constructor(
    private spotifyService: SpotifyService,
    private formatService: FormatService
  ) {}

  ngOnInit() {
    this.spotifyService
      .getPlaybackState()
      .then((data) => {
        this.track = this.formatService.formatTrackPlaying(data.item);
        this.isPlaying = data.is_playing;
        //console.log(data);
      })
      .catch((error) => {
        console.error('Error getting state:', error);
      });
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.spotifyService.resumePlayback(); // Reanuda la reproducción
    } else {
      this.spotifyService.pausePlayback(); // Pausa la reproducción
    }
  }
}
