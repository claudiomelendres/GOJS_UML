import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UmlComponent } from '../app/componentes/uml/uml.component';
import { PaletaComponent } from '../app/componentes/paleta/paleta.component';

import { ItemsService } from '../app/servicios/items.service';

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
  providers: [
    ItemsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
