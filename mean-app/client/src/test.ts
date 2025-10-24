// Required for Angular testing
declare const require: any;
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
);
// Automatically find and load all .spec.ts files
const context = (require as any).context('./', true, /\.spec\.ts$/);
context.keys().map(context);
