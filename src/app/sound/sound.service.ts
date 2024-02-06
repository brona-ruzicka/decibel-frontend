import {DestroyRef, Injectable} from '@angular/core';
import {Group, GroupSelected, SelectedGroup, SelectedSound, Sound, SoundData, SoundId} from "./sound.model";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, combineLatest, map, Observable, shareReplay} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  private readonly API_ROOT = "https://decibel.bronaruzicka.cz/api/";
  private readonly DESELECTED_KEY = "deselectedSounds";


  sounds$: Observable<Sound[]>;
  groups$: Observable<Group[]>;

  private deselectedSubject: BehaviorSubject<Set<SoundId>>;
  deselected$: Observable<Set<SoundId>>;

  soundsWithSelection$: Observable<SelectedSound[]>;
  groupsWithSelection$: Observable<SelectedGroup[]>;

  selectedSounds$: Observable<SelectedSound[]>;


  constructor(http: HttpClient, destroyRef: DestroyRef) {

    this.sounds$ = http
      .get<SoundData[]>(this.API_ROOT + "list")
      .pipe(
        map(items =>
          items.map(item => ({
            id: item.file,
            url: this.API_ROOT + item.file,
            size: item.size,
            name: item.name,
            group: item.group,
          }))
          .sort((a,b) => a.name.localeCompare(b.name))
        ),
        shareReplay(1)
      );

    this.groups$ = this.sounds$
      .pipe(
        map(sounds =>
          Object.entries(sounds.reduce(
            (reducer, sound) => {
              (reducer[sound.group] = reducer[sound.group] ?? []).push(sound);
              return reducer;
            },
            {} as Record<string, Sound[]>
          ))
          .map(([name, sounds]) => {
            return {name, sounds};
          })
          .sort((a,b) => a.name.localeCompare(b.name))
        ),
        shareReplay(1)
      );


    const savedDeselected = localStorage.getItem(this.DESELECTED_KEY);
    const initialDeselected = savedDeselected ? JSON.parse(savedDeselected) : [];

    this.deselectedSubject = new BehaviorSubject(new Set(initialDeselected));
    this.deselectedSubject
      .pipe(
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(deselected =>
        localStorage.setItem(
          this.DESELECTED_KEY,
          JSON.stringify(Array.from(deselected.keys())
          ))
      );

    this.deselected$ = this.deselectedSubject.asObservable();


    this.soundsWithSelection$ = combineLatest(
      [
        this.sounds$,
        this.deselected$
      ],
      (sounds, deselected) => {
        return sounds.map(sound => ({
          ...sound,
          selected: !deselected.has(sound.id)
        }));
      }
    ).pipe(
      shareReplay(1)
    );

    this.groupsWithSelection$ = combineLatest(
      [
        this.groups$,
        this.deselected$
      ],
      (groups, deselected) =>
        groups.map(group => {
          let someSelected = false;
          let allSelected = true;

          const selectedSounds = group.sounds.map(sound => {
            const selected = !deselected.has(sound.id);

            someSelected = selected || someSelected;
            allSelected = selected && allSelected;

            return { ...sound, selected } as SelectedSound;
          })

          const selected: GroupSelected = someSelected ? allSelected ? "all" : "some" : "none";

          return {
            name: group.name,
            selected: selected,
            sounds: selectedSounds
          } as SelectedGroup;
        })
    ).pipe(
      shareReplay(1)
    );


    this.selectedSounds$ = this.soundsWithSelection$.pipe(
      map(sounds => sounds.filter(sound => sound.selected))
    );

  }

  selectSound(sound: Sound, selected: boolean) {
    const deselected = new Set(this.deselectedSubject.getValue());

    if (selected) {
      deselected.delete(sound.id);
    } else {
      deselected.add(sound.id);
    }

    this.deselectedSubject.next(deselected);
  }

  selectGroup(group: Group, selected: boolean) {
    const deselected = new Set(this.deselectedSubject.getValue());

    group.sounds.forEach(sound => {
      if (selected) {
        deselected.delete(sound.id);
      } else {
        deselected.add(sound.id);
      }
    });

    this.deselectedSubject.next(deselected);
  }

}

