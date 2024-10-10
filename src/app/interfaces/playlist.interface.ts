export interface Playlist {
    id: string;
    name: string;
    description: string;
    href: string;
    images: string[];
    public: boolean;
    uri: string;
    external_urls: string;
    tracks: number;
    type: string;
    owner_name: string;
}
