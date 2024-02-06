import {ApplicationConfig, DestroyRef} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {SoundService} from "./sound/sound.service";
import {HttpClient} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync()
  ]
};
