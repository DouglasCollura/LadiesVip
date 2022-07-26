import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { GoogleMapsModule } from '@angular/google-maps'
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PagesModule,
    AppRoutingModule,
    ComponentsModule,
    GoogleMapsModule  
  ],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

 // ID GOOGLE LOCALHOST 998158333459-v13en8bhgur1on2evjum0g9h37mod054.apps.googleusercontent.com
  // ID GOOGLE DEVELOPER 710857039553-pc3j2qjte7573b1t9dnjd2h6g73gvlb1.apps.googleusercontent.com
  // 795455795179427 DEV
  // LOCAL 469352731536276
