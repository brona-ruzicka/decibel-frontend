import { Component , inject } from '@angular/core';
import {Menu_item_data} from "./menu_item_data";
import {Menu_itemService} from "./menu_item.service";
import {NgForOf} from "@angular/common";



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})


export class MenuComponent {
  Menu_ItemService= inject(Menu_itemService);

  Menu_item_data: Menu_item_data[] = [];

  constructor() {
    this.Menu_item_data = this.Menu_ItemService.getAllPosts()
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
