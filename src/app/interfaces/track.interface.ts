import { Album } from "./album.interface";
import { Artist } from "./artist.interface";
import { Image } from "./image.interface";

export interface Track {
    id: string;
    name: string;
    album?: Album;
    artists: Artist[];
    external_urls?: string;
    preview_url: string;
    uri: string;
}

export interface TrackPlaying {
    id: string;
    name: string;
    album_cover: Image[];
    album_name: string;
    artists: Artist[];
    uri: string;
    position_ms?: number;
}
