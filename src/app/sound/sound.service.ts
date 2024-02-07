import {DestroyRef, Injectable} from '@angular/core';
import {Group, GroupSelection, GroupWithSelection, Sound, SoundData, SoundId, SoundWithSelection} from './sound.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, shareReplay, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {asObservable, MaybeObservable} from '../../util/maybeObservable';
import {Optional} from '../../util/optional';

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  private readonly API_ROOT = 'https://decibel.bronaruzicka.cz/api/';
  private readonly DESELECTED_KEY = 'deselectedSounds';


  sounds$: Observable<Sound[]>;
  groups$: Observable<Group[]>;

  private deselectedSubject: BehaviorSubject<Set<SoundId>>;
  deselected$: Observable<Set<SoundId>>;

  soundsWithSelection$: Observable<SoundWithSelection[]>;
  groupsWithSelection$: Observable<GroupWithSelection[]>;

  selectedSounds$: Observable<Sound[]>;


  constructor(http: HttpClient, destroyRef: DestroyRef) {

    this.sounds$ = http
      .get<SoundData[]>(this.API_ROOT + 'list')
      .pipe(
        map(items =>
          items.map(item => ({
            id: item.file,
            url: this.API_ROOT + item.file,
            size: item.size,
            name: item.name,
            group: item.group,
          }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        ),
        distinctUntilChanged(),
        shareReplay(1),
      );

    this.groups$ = this.sounds$
      .pipe(
        map(sounds =>
          Object.entries(sounds.reduce(
            (reducer, sound) => {
              (reducer[sound.group] = reducer[sound.group] ?? []).push(sound);
              return reducer;
            },
            {} as Record<string, Sound[]>,
          ))
            .map(([name, sounds]) => {
              return {name, sounds};
            })
            .sort((a, b) => a.name.localeCompare(b.name)),
        ),
        distinctUntilChanged(),
        shareReplay(1),
      );


    const savedDeselected = localStorage.getItem(this.DESELECTED_KEY);
    const initialDeselected = savedDeselected ? JSON.parse(savedDeselected) : [];

    this.deselectedSubject = new BehaviorSubject(new Set(initialDeselected));
    this.deselected$ = this.deselectedSubject.asObservable()
      .pipe(
        distinctUntilChanged(),
      );

    this.deselected$
      .pipe(
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(deselected =>
        localStorage.setItem(
          this.DESELECTED_KEY,
          JSON.stringify(Array.from(deselected.keys())),
        ),
      );


    this.soundsWithSelection$ = combineLatest(
      [
        this.sounds$,
        this.deselected$,
      ],
      (sounds, deselected) => {
        return sounds.map(sound => ({
          ...sound,
          selected: !deselected.has(sound.id),
        }));
      },
    ).pipe(
      distinctUntilChanged(),
      shareReplay(1),
    );

    this.groupsWithSelection$ = combineLatest(
      [
        this.groups$,
        this.deselected$,
      ],
      (groups, deselected) =>
        groups.map(group => {
          let someSelected = false;
          let allSelected = true;

          const selectedSounds = group.sounds.map(sound => {
            const selected = !deselected.has(sound.id);

            someSelected = selected || someSelected;
            allSelected = selected && allSelected;

            return {...sound, selected} as SoundWithSelection;
          });

          const selected: GroupSelection = someSelected ? allSelected ? 'all' : 'some' : 'none';

          return {
            name: group.name,
            selected: selected,
            sounds: selectedSounds,
          } as GroupWithSelection;
        }),
    ).pipe(
      distinctUntilChanged(),
      shareReplay(1),
    );


    this.selectedSounds$ = combineLatest(
      [
        this.sounds$,
        this.deselected$,
      ],
      (sounds, deselected) => sounds.filter(sound => !deselected.has(sound.id)),
    ).pipe(
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  soundWithSelection$(sound$: MaybeObservable<Sound>): Observable<Optional<SoundWithSelection>> {
    return asObservable(sound$).pipe(
      switchMap(sound =>
        this.soundsWithSelection$.pipe(
          map(soundWithSelection =>
            soundWithSelection.find(soundWithSelection => soundWithSelection.id == sound.id),
          ),
        ),
      ),
      distinctUntilChanged(),
    );
  }

  groupWithSelection$(group$: MaybeObservable<Group>): Observable<Optional<GroupWithSelection>> {
    return asObservable(group$).pipe(
      switchMap(group =>
        this.groupsWithSelection$.pipe(
          map(groupsWithSelection =>
            groupsWithSelection.find(groupWithSelection => groupWithSelection.name == group.name),
          ),
        ),
      ),
      distinctUntilChanged(),
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

