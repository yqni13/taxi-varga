import { Injectable } from "@angular/core";

export declare interface AssetsPreload {
    images?: string[],
    videos?: string[]
}

@Injectable({
    providedIn: 'root'
})
export class AssetsPreloadService {

    constructor() {
        //
    }

    private preloadImages(paths: string[] | undefined): Promise<void[]> {
        if(!paths || paths.length === 0) {
            return Promise.resolve([]);
        }
        const preloadPromises = paths.map((path) => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => resolve();
                img.onerror = () => reject(`image not found: ${path}`);
            });
        })
        return Promise.all(preloadPromises);
    }

    private preloadVideos(paths: string[] | undefined): Promise<void[]> {
        if(!paths || paths.length === 0) {
            return Promise.resolve([]);
        }
        const preloadPromises = paths.map((path) => {
            return new Promise<void>((resolve, reject) => {
                const video = document.createElement('video');
                video.preload = 'auto';
                video.src = path;
                video.muted = true; //condition for autoplay - if needed, adapt on video usage
                video.playsInline = true;

                const cleanup = () => {
                    video.removeEventListener('loadeddata', onDataLoad);
                    video.removeEventListener('error', onError);
                }

                const onDataLoad = () => {
                    cleanup();
                    resolve();
                }

                const onError = () => {
                    cleanup();
                    reject(new Error(`video failed to load: ${path}`));
                }

                video.addEventListener('loadeddata', onDataLoad);
                video.addEventListener('error', onError);
                video.load();
            });
        });
        return Promise.all(preloadPromises);
    }

    preloadAssets(content: AssetsPreload): Promise<[void[], void[]]> {
        return Promise.all([
            this.preloadImages(content?.images),
            this.preloadVideos(content?.videos)
        ]);
    }
}