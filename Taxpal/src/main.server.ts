import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Do NOT import BootstrapContext
export default function bootstrap(context: any) { 
  return bootstrapApplication(AppComponent, config, context);
}
