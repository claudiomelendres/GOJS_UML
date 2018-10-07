import { Component, OnInit } from '@angular/core';
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

  constructor() { }



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


    function convertVisibility(v) {
      switch (v) {
        case 'public': return '+';
        case 'private': return '-';
        case 'protected': return '#';
        case 'package': return '~';
        default: return v;
      }
    }

    const propertyTemplate =
      $(go.Panel, 'Horizontal',
        $(go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)),

        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'; })),

        $(go.TextBlock, '',
          new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'type').makeTwoWay()),
 
        $(go.TextBlock,
          { isMultiline: false, editable: false },
          new go.Binding('text', 'default', function(s) { return s ? ' = ' + s : ''; }))
      );

    const methodTemplate =
      $(go.Panel, 'Horizontal',

        $(go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)),

        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'; })),

        $(go.TextBlock, '()',

          new go.Binding('text', 'parameters', function(parr) {
              let s = '(';
              for (let i = 0; i < parr.length; i++) {
                const param = parr[i];
                if (i > 0) { s += ', '; }
                s += param.name + ': ' + param.type;
              }
              return s + ')';
          })),

        $(go.TextBlock, '',
          new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'type').makeTwoWay())
      );

    this.myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          locationSpot: go.Spot.Center,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        $(go.Shape, 'RoundedRectangle',
        {
          strokeWidth: 1,
          fill: 'lightyellow' ,
          portId: '', cursor: 'pointer',
          fromLinkable: true,
          toLinkable: true
        },
        new go.Binding('fill', 'color')),
        $(go.Panel, 'Table',
          { defaultRowSeparatorStroke: 'black' },
          $(go.TextBlock,
            {
              row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
              font: 'bold 12pt sans-serif',
              isMultiline: false, editable: true
            },
            new go.Binding('text', 'name').makeTwoWay()),
          $(go.TextBlock, 'Properties',
            { row: 1, font: 'italic 10pt sans-serif' },
            new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('PROPERTIES')),
          $(go.Panel, 'Vertical', { name: 'PROPERTIES' },
            new go.Binding('itemArray', 'properties'),
            {
              row: 1, margin: 3, stretch: go.GraphObject.Fill,
              defaultAlignment: go.Spot.Left,
              itemTemplate: propertyTemplate
            }
          ),
          $('PanelExpanderButton', 'PROPERTIES',
            { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
            new go.Binding('visible', 'properties', function(arr) { return arr.length > 0; })),
          $(go.TextBlock, 'Methods',
            { row: 2, font: 'italic 10pt sans-serif' },
            new go.Binding('visible', 'visible', function(v) { return !v; }).ofObject('METHODS')),
          $(go.Panel, 'Vertical', { name: 'METHODS' },
            new go.Binding('itemArray', 'methods'),
            {
              row: 2, margin: 3, stretch: go.GraphObject.Fill,
              defaultAlignment: go.Spot.Left,
              itemTemplate: methodTemplate
            }
          ),
          $('PanelExpanderButton', 'METHODS',
            { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
            new go.Binding('visible', 'methods', function(arr) { return arr.length > 0; }))
        )
      );
    function convertIsTreeLink(r) {
      return r === 'generalization';
    }
    function convertFromArrow(r) {
      switch (r) {
        case 'generalization': return '';
        default: return '';
      }
    }
    function convertToArrow(r) {
      switch (r) {
        case 'generalization': return 'Triangle';
        case 'aggregation': return 'StretchedDiamond';
        case 'use': return 'OpenTriangle';
        default: return '';
      }
    }
    this.myDiagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.None },
        new go.Binding('isLayoutPositioned', 'relationship', convertIsTreeLink),
        $(go.Shape,
          new go.Binding('stroke', 'color'),
          new go.Binding('strokeDashArray', 'dash')
          ),
        $(go.Shape, { scale: 1.3, fill: 'red' },
          new go.Binding('fromArrow', 'relationship', convertFromArrow)),
        $(go.Shape, { scale: 1.3, fill: 'white' },
          new go.Binding('toArrow', 'relationship', convertToArrow))
      );


      function InfoLink(fromnode, fromport, tonode, toport) {
        that.error = false;
        console.log('fromnode');
        console.log(fromnode);
        console.log('tonode');
        console.log(tonode);
        if (tonode.Yd.color === 'pink' && (that.typeLink === 'use' || that.typeLink === 'aggregation')) {
          that.errorMensaje = ' No es posible usar enlaces de: ' + that.typeLink + ' con interfaces ';
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
       console.log('cambiando');
       console.log(e);
       console.log(that.typeLink);
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

    this.nodedata = [
      // {
      //   key: 1,
      //   name: 'BankAccount', color: 'lightblue', loc: new go.Point(500, 500),
      //   properties: [
      //     { name: 'owner', type: 'String', visibility: 'public' },
      //     { name: 'balance', type: 'Currency', visibility: 'public', default: '0' }
      //   ],
      //   methods: [
      //     { name: 'deposit', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' },
      //     { name: 'withdraw', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' }
      //   ]
      // },
      // {
      //   key: 11,
      //   name: 'Person', color : 'lightgreen',
      //   properties: [
      //     { name: 'name', type: 'String', visibility: 'public' },
      //     { name: 'birth', type: 'Date', visibility: 'protected' }
      //   ],
      //   methods: [
      //     { name: 'getCurrentAge', type: 'int', visibility: 'public' }
      //   ]
      // },
      // {
      //   key: 12,
      //   name: 'Student',
      //   properties: [
      //     { name: 'classes', type: 'List<Course>', visibility: 'public' }
      //   ],
      //   methods: [
      //     { name: 'attend', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' },
      //     { name: 'sleep', visibility: 'private' }
      //   ]
      // },
      // {
      //   key: 13,
      //   name: 'Professor',
      //   properties: [
      //     { name: 'classes', type: 'List<Course>', visibility: 'public' }
      //   ],
      //   methods: [
      //     { name: 'teach', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' }
      //   ]
      // },
      // {
      //   key: 14,
      //   name: 'Course', color: 'pink',
      //   properties: [
      //     { name: 'name', type: 'String', visibility: 'public' },
      //     { name: 'description', type: 'String', visibility: 'public' },
      //     { name: 'professor', type: 'Professor', visibility: 'public' },
      //     { name: 'location', type: 'String', visibility: 'public' },
      //     { name: 'times', type: 'List<Time>', visibility: 'public' },
      //     { name: 'prerequisites', type: 'List<Course>', visibility: 'public' },
      //     { name: 'students', type: 'List<Student>', visibility: 'public' }
      //   ]
      // }
    ];
    this.linkdata = [
      // { from: 1, to: 11, relationship: 'generalization' },
      // { from: 13, to: 11, relationship: 'generalization' },
      // { from: 14, to: 13, relationship: 'aggregation' },
      // { from: 12, to: 1, relationship: 'use' }
    ];

    this.myDiagram.model = $(go.GraphLinksModel,
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: this.nodedata,
        linkDataArray: this.linkdata
      });
  }
}
