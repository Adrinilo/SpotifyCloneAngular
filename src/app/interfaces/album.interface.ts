import { Artist } from "./artist.interface";
import { Image } from "./image.interface";

export interface Album {
    id: string;
    name: string;
    total_tracks: number;
    external_urls: string;
    release_date: string;
    images: Image[];
    artists: Artist[];
}
