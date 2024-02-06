import {Component, DestroyRef} from '@angular/core';
import {SoundService} from "../sound/sound.service";
import {Group, SelectedGroup, SelectedSound, Sound, SoundId} from "../sound/sound.model";
import {MatCheckbox} from "@angular/material/checkbox";
import {CommonModule} from "@angular/common";
import {SoundModule} from "../sound/sound.module";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from "@angular/material/tree";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FlatTreeControl} from "@angular/cdk/tree";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


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
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  private transformer = (node: Group | Sound, level: number): SidebarNode => {
    return {
      group: !("id" in node),
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
    node => "id" in node ? [] : node.sounds,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(protected soundService: SoundService, destroyRef: DestroyRef) {
    soundService.groups$
      .pipe(
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(groups => this.dataSource.data = groups);
  }


  isGroup = (_: number, node: SidebarNode) => node.group;


  selectGroup(group: SelectedGroup, selected: boolean) {
    this.soundService.selectGroup(group, selected)
  }

  selectSound(sound: SelectedSound, selected: boolean) {
    this.soundService.selectSound(sound, selected)
  }

  protected readonly JSON = JSON;
}
