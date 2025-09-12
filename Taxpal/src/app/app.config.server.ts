import { ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { provideServerRendering } from '@angular/platform-server';

export const config: ApplicationConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers ?? [],
    provideServerRendering(),
  ],
};
