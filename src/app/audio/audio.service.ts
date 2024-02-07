import {DestroyRef, Injectable} from '@angular/core';
import {Sound} from '../sound/sound.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, distinctUntilChanged, map, Observable, pairwise} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root',
})
export class AudioService {

  private playingSubject = new BehaviorSubject<Sound | null>(null);


  currentSound$ = this.playingSubject.asObservable();
  isPlaying$: Observable<boolean> = this.currentSound$
    .pipe(
      map(sound => sound !== null),
      distinctUntilChanged()
    );


  constructor(
    destroyRef: DestroyRef,
  ) {

    this.playingSubject
      .pipe(
        takeUntilDestroyed(destroyRef),
        pairwise()
      )
      .subscribe(([last, next]) => {
        if (last) {
          const lastAudio = this.loaded[last.url]
          lastAudio.pause();
          lastAudio.currentTime = 0;
        }
        if (next) {
          const nextAudio = this.loadAudio(next.url);
          nextAudio.play().catch(err => null);
        }
      });

  }


  private loaded: Record<string, HTMLAudioElement> = {};

  private loadAudio(url: string): HTMLAudioElement {
    if (url in this.loaded)
      return this.loaded[url];

    const audio = new Audio(url);
    audio.addEventListener("ended", () =>  this.playingSubject.next(null));

    this.loaded[url] = audio;
    return audio;
  }


  load(sound: Sound) {
    this.loadAudio(sound.url);
  }

  play(sound: Sound) {
    this.playingSubject.next(sound);
  }

  stop() {
    this.playingSubject.next(null);
  }


  // TODO
  // snackBar() {
  //   this.snackBar.open(
  //     sound.name,
  //     undefined,
  //     {
  //       horizontalPosition: 'right',
  //       duration: 2500,
  //     }
  //   );
  // }

}
