import { Album } from "./album.interface";
import { Artist } from "./artist.interface";

export interface Track {
    id: string;
    name: string;
    album?: Album;
    artists: Artist[];
    external_urls?: string;
    preview_url: string;
    uri: string;
}
