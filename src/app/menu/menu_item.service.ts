import { Injectable } from '@angular/core';
import {Menu_item_data} from "./menu_item_data";

@Injectable({
  providedIn: 'root'
})
export class Menu_itemService {

  music: Menu_item_data[] = [
    {file:"sounds\/05_balada_konec.mp3","size":2322432,name:"[05] Balada Konec",group:"Muzik\u00e1l Olafovy V\u00e1noce"},
    {file:"sounds\/04_balada_zacatek.mp3","size":2772992,name:"[04] Balada Za\u010d\u00e1tek",group:"Muzik\u00e1l Olafovy V\u00e1noce"},

  ]

  getAllPosts(): Menu_item_data[] {
    return this.music;
  }

  getPost(id: number): Menu_item_data | undefined {
    return this.music.find(post => post.file == post.file);
  }

}
