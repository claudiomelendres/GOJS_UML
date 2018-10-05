import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor.component';
import { BasicComponent } from './basic/basic.component';
import { MinimalComponent } from './minimal/minimal.component';
import { UmlComponent } from './uml/uml.component';
import { PaletaComponent } from './paleta/paleta.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagramEditorComponent,
    BasicComponent,
    MinimalComponent,
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
