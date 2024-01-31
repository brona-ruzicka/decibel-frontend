import { Injectable } from '@angular/core';
import {SoundData} from "./sound_data";


@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private readonly apiRoot = "https://decibel.bronaruzicka.cz/api/";

  readonly sounds: Promise<SoundData[]> = fetch(this.apiRoot + "list")
    .then(response => response.json())
    .then((items: SoundData[]) => {
      for (let item of items)
        item.url = this.apiRoot + item.file;
      items.sort((a,b) => a.name.localeCompare(b.name))
      return items;
    });


  // music: SoundData[] = [
  //   {file:"sounds\/05_balada_konec.mp3","size":2322432,name:"[05] Balada Konec",group:"Muzik\u00e1l Olafovy V\u00e1noce"},
  //   {file:"sounds\/04_balada_zacatek.mp3","size":2772992,name:"[04] Balada Za\u010d\u00e1tek",group:"Muzik\u00e1l Olafovy V\u00e1noce"},
  //
  // ]
  //
  // getAllPostsOld(): SoundData[] {
  //   return this.music;
  // }
  //
  // getPost(id: number): SoundData | undefined {
  //   return this.music.find(post => post.file == post.file);
  // }

}

