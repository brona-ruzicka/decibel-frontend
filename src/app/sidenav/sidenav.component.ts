import { Component } from '@angular/core';
import {SoundService} from "../sound/sound.service";
import {Group, Sound} from "../sound/sound.model";
import {MatCheckbox} from "@angular/material/checkbox";
import {AsyncPipe, CommonModule, NgForOf} from "@angular/common";
import {SoundModule} from "../sound/sound.module";


@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    SoundModule,
    MatCheckbox,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  constructor(private soundService: SoundService) { }

  groupsWithSelection$ = this.soundService.groupsWithSelection$;

  selectSound(sound: Sound, selected: boolean) {
    this.soundService.selectSound(sound, selected)
  }
  selectGroup(group: Group, selected: boolean) {
    this.soundService.selectGroup(group, selected)
  }

}
