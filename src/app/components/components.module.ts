import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalesComponent } from './modales/modales.component';



@NgModule({
  declarations: [
    ModalesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports:[
    ModalesComponent
  ]
})
export class ComponentsModule { }
