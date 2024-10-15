import { Owner } from "./owner.interface";
import { Track } from "./track.interface";

export interface Playlist {
    id: string;
    description: string;
    external_urls: string;
    followers: number;
    href: string;
    images: string[];
    name: string;
    owner: Owner;
    public: string;
    tracks_total: number;
    tracks: Track[];
    type: string;
    uri: string;
    duration: string;
}
