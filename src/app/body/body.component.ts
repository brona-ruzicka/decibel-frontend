import {ChangeDetectionStrategy, Component, DestroyRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SoundModule} from '../sound/sound.module';
import {SoundService} from '../sound/sound.service';
import {MatListModule} from '@angular/material/list';
import {MatButton} from '@angular/material/button';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AudioService} from '../audio/audio.service';
import {Sound} from '../sound/sound.model';


function shuffle<T>(array: T[]): T[] {
  array = [...array];

  let currentIndex = array.length;
  while (currentIndex > 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);

    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

  }

  return array;
}


@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    CommonModule,
    SoundModule,
    MatListModule,
    MatButton,
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {

  sounds: Sound[] = [];
  nextIndex: number = 0;

  constructor(
    private audioService: AudioService,
    soundService: SoundService,
    destroyRef: DestroyRef,
  ) {

    soundService.selectedSounds$.pipe(
      takeUntilDestroyed(destroyRef),
    ).subscribe(sounds => {
      this.sounds = sounds;
      this.loadNext(true);
    });

  }

  private loadNext(forceShuffle = false) {
    if (this.sounds.length == 0)
      return;

    if (this.nextIndex >= this.sounds.length || forceShuffle) {
      this.sounds = shuffle(this.sounds);
      this.nextIndex = 0;
    }

    this.audioService.load(this.sounds[this.nextIndex]);
  }

  playRandom() {
    if (this.nextIndex < this.sounds.length) {
      this.audioService.play(this.sounds[this.nextIndex]);
      this.nextIndex++;
    }

    this.loadNext();
  }

}
