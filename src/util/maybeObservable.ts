import {isObservable, Observable, of} from "rxjs";


export type MaybeObservable<T> = T | Observable<T>;

export function asObservable<T>(t: MaybeObservable<T>) {
  return isObservable(t) ? t : of(t);
}
