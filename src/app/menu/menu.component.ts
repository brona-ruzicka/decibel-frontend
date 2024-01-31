import { Component , inject } from '@angular/core';
import {SoundData} from "../sound/sound_data";
import {SoundService} from "../sound/sound.service";
import { CommonModule } from "@angular/common";



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})


export class MenuComponent {

  sounds: SoundData[] = [];

  constructor(
    private soundService: SoundService
  ) {
    soundService.sounds.then(sounds => this.sounds = sounds)
  }

  private audio: HTMLAudioElement = new Audio();
  private playing: boolean = false;
  private currentMusic: string | null = null;

  play_audio(file_url:any){
      this.stopMusic();
      this.audio.src = file_url;
      this.audio.play();
      this.playing = true;
      this.currentMusic = file_url;

      // Wait until the music finishes playing
      this.audio.addEventListener('ended', () => {
        this.stopMusic();
      });
    }
    stopMusic(): void {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.playing = false;
      this.currentMusic = null;
    }
}


document.addEventListener("DOMContentLoaded", () => {
  function toggleSidebar() {
    const button = document.querySelector<HTMLDivElement>(".button");
    const main = document.querySelector<HTMLElement>("main");
    const sidebarItems = document.querySelectorAll<HTMLElement>(".sidebar-item");

    button?.classList.toggle("active");
    main?.classList.toggle("move-to-left");
    sidebarItems.forEach((item) => item.classList.toggle("active"));
  }

  const button = document.querySelector<HTMLDivElement>(".button");
  button?.addEventListener("click", () => {
    toggleSidebar();
  });

  document.addEventListener("keyup", (e) => {
    if (e.keyCode === 27) {
      toggleSidebar();
    }
  });
});
