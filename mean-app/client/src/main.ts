import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

console.log('🚀 Bootstrapping Angular app...');

bootstrapApplication(App, appConfig)
  .then(() => console.log('✅ Angular app bootstrapped successfully'))
  .catch(err => {
    console.error('❌ Angular bootstrap failed:', err);
  });