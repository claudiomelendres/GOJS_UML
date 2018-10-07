import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UmlComponent } from './uml/uml.component';
import { PaletaComponent } from './paleta/paleta.component';

@NgModule({
  declarations: [
    AppComponent,
    UmlComponent,
    PaletaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
