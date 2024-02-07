import {ChangeDetectionStrategy, Component, DestroyRef} from '@angular/core';
import {SoundService} from '../sound/sound.service';
import {Group, GroupSelection, Sound} from '../sound/sound.model';
import {MatCheckbox} from '@angular/material/checkbox';
import {CommonModule} from '@angular/common';
import {SoundModule} from '../sound/sound.module';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FlatTreeControl} from '@angular/cdk/tree';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, Observable} from 'rxjs';
import {AudioService} from '../audio/audio.service';


interface SidebarNode {
  group: boolean,
  level: number,
  ref: Sound | Group
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    SoundModule,
    MatTreeModule,
    MatCheckbox,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {

  private transformer = (node: Group | Sound, level: number): SidebarNode => {
    return {
      group: "sounds" in node,
      level: level,
      ref: node,
    };
  };

  treeControl = new FlatTreeControl<SidebarNode>(
    node => node.level,
    node => node.group,
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.group,
    node => "sounds" in node ? node.sounds : [],
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(
    private audioService: AudioService,
    private soundService: SoundService,
    destroyRef: DestroyRef
  ) {
    soundService.groups$
      .pipe(
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(groups => this.dataSource.data = groups);
  }


  isGroupNode = (_: number, node: SidebarNode) => node.group;



  isGroupSelected$(group: Group): Observable<GroupSelection> {
    return this.soundService.groupWithSelection$(group).pipe(
      map(group => group?.selected ?? "all")
    )
  }

  isSoundSelected$(sound: Sound): Observable<boolean> {
    return this.soundService.soundWithSelection$(sound).pipe(
      map(sound => sound?.selected ?? true)
    )
  }

  selectGroup(group: Group, selected: boolean) {
    this.soundService.selectGroup(group, selected)
  }

  selectSound(sound: Sound, selected: boolean) {
    this.soundService.selectSound(sound, selected)
  }


  loadSound(sound: Sound) {
    this.audioService.load(sound);
  }

  playSound(sound: Sound) {
    this.audioService.play(sound);
  }
}
