import {Injectable} from '@angular/core';
import {Sound} from '../sound/sound.model';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class AudioService {

  private playing: HTMLAudioElement | null = null;
  private loaded: Record<string, HTMLAudioElement | null> = {};

  play(sound: Sound) {
    const audio = this.loaded[sound.url] ?? ( this.loaded[sound.url] = new Audio(sound.url) );

    if (this.playing) {
      this.playing.pause();
      this.playing.currentTime = 0;
    }

    this.playing = audio;
    audio.play().catch(err => {});
  }

  load(sound: Sound) {
    if (this.loaded[sound.url])
      return;

    this.loaded[sound.url] = new Audio(sound.url);
  }

}
