import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';
import { Diagrama } from '../../clases/Diagrama';
import { ItemsService } from '../../servicios/items.service';

@Component({
  selector: 'app-paleta',
  templateUrl: './paleta.component.html',
  styleUrls: ['./paleta.component.css']
})
export class PaletaComponent implements OnInit {

  diagrama: Diagrama;
  constructor( private _itemsService: ItemsService) {
      const $ = go.GraphObject.make;
      this.diagrama = new Diagrama($);

   }

  ngOnInit() {
    const $ = go.GraphObject.make;

    const myDiagram =
      $(go.Palette, 'myPaletteDiv',
        {
          initialContentAlignment: go.Spot.Center
        });

    myDiagram.nodeTemplate = this.diagrama.NodeTemplate;
    const nodedata = this._itemsService.getItemsPaleta();
    myDiagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: nodedata,
      });
  }

}
