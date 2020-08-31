import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ImageComponent } from './image/image.component';
import { PageMeComponent } from './pages/page-me/page-me.component';
import { PageExperienceComponent } from './pages/page-experience/page-experience.component';
import { PageContactComponent } from './pages/page-contact/page-contact.component';
import { PageDirective } from './page.directive';
import { PulloutNavComponent } from './pullout-nav/pullout-nav.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    ImageComponent,
    PageMeComponent,
    PageExperienceComponent,
    PageContactComponent,
    PageDirective,
    PulloutNavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: "", component: AppComponent}])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
