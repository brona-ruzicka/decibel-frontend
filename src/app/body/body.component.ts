import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SoundModule} from "../sound/sound.module";
import {SoundService} from "../sound/sound.service";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    CommonModule,
    SoundModule,
    MatListModule
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

  constructor(private soundService: SoundService) { }

  selectedSounds$ = this.soundService.selectedSounds$

}
