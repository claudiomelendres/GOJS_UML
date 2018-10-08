import { Component, OnInit } from '@angular/core';
import { Diagrama } from '../../clases/Diagrama';
import * as go from 'gojs';

@Component({
  selector: 'app-uml',
  templateUrl: './uml.component.html',
  styleUrls: ['./uml.component.css']
})
export class UmlComponent implements OnInit {

  private myDiagram;
  private nodedata;
  private linkdata;
  private $ = go.GraphObject.make;
  typeLink = 'use';
  private doted = false;
  error = false;
  errorMensaje = '';

  diagrama: Diagrama;
  constructor() {
    const $ = go.GraphObject.make;
    this.diagrama = new Diagrama($);
  }



  ngOnInit() {
    const that = this;
    const $ = this.$;
    this.myDiagram =
      $(go.Diagram, 'myDiagramDiv',
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,
          'undoManager.isEnabled': true
        });

    this.myDiagram.nodeTemplate = this.diagrama.NodeTemplate;

    this.myDiagram.linkTemplate = this.diagrama.LinkTemplate;

      function InfoLink(fromnode, fromport, tonode, toport) {
        that.error = false;
        if (tonode.Yd.color === 'pink' && (that.typeLink === 'use' || that.typeLink === 'aggregation')) {
          that.errorMensaje = ' No es posible usar enlaces de: -' + that.typeLink + '- con interfaces ';
          that.error = true;
          return false;
        }

        if (tonode.Yd.color === 'pink') {
          that.doted = true;
        } else {
          that.doted = false;
        }
        return true;
      }

      this.myDiagram.toolManager.linkingTool.linkValidation = InfoLink;

      this.myDiagram.addDiagramListener('LinkDrawn', function(e) {
       const model = e.diagram.model;

          const data = model.linkDataArray[model.linkDataArray.length - 1];
          const myFrom = data.from;
          const myTo = data.to;
          model.startTransaction('reconnect link');
          model.removeLinkData(data);
          let linkdata;
          if ( that.doted ) {
            linkdata = { from: myFrom, to: myTo, relationship: that.typeLink, dash: [3, 2] };
          } else {
            linkdata = { from: myFrom, to: myTo, relationship: that.typeLink };
          }
          model.addLinkData(linkdata);
          model.commitTransaction('reconnect link');
    });

    this.nodedata = [];
    this.linkdata = [];

    this.myDiagram.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: this.nodedata,
        linkDataArray: this.linkdata
      });
  }
}
