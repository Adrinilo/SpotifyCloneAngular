import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Playlist } from '../../interfaces/playlist.interface';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent implements OnInit, OnDestroy {
  playlists: Playlist[] = [];
  private scrollTimeout: any;

  constructor(
    private spotifyService: SpotifyService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.spotifyService
        .getUserPlaylists()
        .then((data) => {
          this.playlists = this.formatPlaylists(data.items);
        })
        .catch((error) => {
          console.error('Error fetching playlists:', error);
        });
    }

    const scrollContainer =
      this.elRef.nativeElement.querySelector('.contenedor-scroll');

    // Agregar el listener de scroll
    this.renderer.listen(scrollContainer, 'scroll', () => {
      this.showScrollbar(scrollContainer);
    });
  }

  playlistDetails(id: string) {
    this.router.navigate(['/playlist', id]);
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
        external_urls: item.external_urls.spotify,
        type: item.type == 'playlist' ? 'Lista' : item.type,
        owner_name: item.owner.display_name,
      };
      return playlist;
    });
  }

  showScrollbar(container: HTMLElement): void {
    // Añadir la clase para mostrar el scrollbar
    this.renderer.addClass(container, 'scrolling');

    // Limpiar cualquier timeout anterior
    clearTimeout(this.scrollTimeout);

    // Después de 1 segundo, quitar la clase para ocultar el scrollbar
    this.scrollTimeout = setTimeout(() => {
      this.renderer.removeClass(container, 'scrolling');
    }, 1000); // El tiempo que la barra de scroll queda visible después del scroll
  }

  ngOnDestroy(): void {
    // Limpiar el timeout cuando el componente sea destruido
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}
