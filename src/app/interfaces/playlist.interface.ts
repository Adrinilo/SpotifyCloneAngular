import { User } from "./user.interface";
import { Track } from "./track.interface";

export interface Playlist {
    id: string;
    description: string;
    external_urls: string;
    followers: number;
    href: string;
    images: string[];
    name: string;
    owner: User;
    public: string;
    tracks_total: number;
    tracks: Track[];
    type: string;
    uri: string;
    duration: string;
}
