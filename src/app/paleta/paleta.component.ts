import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-paleta',
  templateUrl: './paleta.component.html',
  styleUrls: ['./paleta.component.css']
})
export class PaletaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const $ = go.GraphObject.make;
    const myDiagram =
      $(go.Palette, 'myPaletteDiv',
        {
          initialContentAlignment: go.Spot.Center
        });
    // show visibility or access as a single character at the beginning of each property or method
    function convertVisibility(v) {
      switch (v) {
        case 'public': return '+';
        case 'private': return '-';
        case 'protected': return '#';
        case 'package': return '~';
        default: return v;
      }
    }
    // the item template for properties
    const propertyTemplate =
      $(go.Panel, 'Horizontal',
        // property visibility/access
        $(go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)),
        // property name, underlined if scope=='class' to indicate static property
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'; })),
        // property type, if known
        $(go.TextBlock, '',
          new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'type').makeTwoWay()),
        // property default value, if any
        $(go.TextBlock,
          { isMultiline: false, editable: false },
          new go.Binding('text', 'default', function(s) { return s ? ' = ' + s : ''; }))
      );
    // the item template for methods
    const methodTemplate =
      $(go.Panel, 'Horizontal',
        // method visibility/access
        $(go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', convertVisibility)),
        // method name, underlined if scope=='class' to indicate static method
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('isUnderline', 'scope', function(s) { return s[0] === 'c'; })),
        // method parameters
        $(go.TextBlock, '()',
          // this does not permit adding/editing/removing of parameters via inplace edits
          new go.Binding('text', 'parameters', function(parr) {
              let s = '(';
              for (let i = 0; i < parr.length; i++) {
                const param = parr[i];
                if (i > 0) { s += ', '; }
                s += param.name + ': ' + param.type;
              }
              return s + ')';
          })),
        // method return type, if any
        $(go.TextBlock, '',
          new go.Binding('text', 'type', function(t) { return (t ? ': ' : ''); })),
        $(go.TextBlock,
          { isMultiline: false, editable: true },
          new go.Binding('text', 'type').makeTwoWay())
      );
    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate =
      $(go.Node, 'Auto',
        {
          locationSpot: go.Spot.Center,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        },
        $(go.Shape,  { strokeWidth: 1, fill: 'lightyellow' },
        new go.Binding('fill', 'color')),
        $(go.Panel, 'Table',
          { defaultRowSeparatorStroke: 'black' },
          // header
          $(go.TextBlock,
            {
              row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
              font: 'bold 12pt sans-serif',
              isMultiline: false, editable: true
            },
            new go.Binding('text', 'name').makeTwoWay()),
          // properties
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
          // methods
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


    // setup a few example class nodes and relationships
    const nodedata = [
      {
        key: 1,
        name: 'BankAccount', color: 'lightblue',
        properties: [
          { name: 'owner', type: 'String', visibility: 'public' },
          { name: 'balance', type: 'Currency', visibility: 'public', default: '0' }
        ],
        methods: [
          { name: 'deposit', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' },
          { name: 'withdraw', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' }
        ]
      },
      {
        key: 11,
        name: 'Person', color : 'lightgreen',
        properties: [
          { name: 'name', type: 'String', visibility: 'public' },
          { name: 'birth', type: 'Date', visibility: 'protected' }
        ],
        methods: [
          { name: 'getCurrentAge', type: 'int', visibility: 'public' }
        ]
      },
      {
        key: 12,
        name: 'Student',
        properties: [
          { name: 'classes', type: 'List<Course>', visibility: 'public' }
        ],
        methods: [
          { name: 'attend', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' },
          { name: 'sleep', visibility: 'private' }
        ]
      },
      {
        key: 14,
        name: 'Course', color: 'pink',
        properties: [
          { name: 'name', type: 'String', visibility: 'public' },
          { name: 'description', type: 'String', visibility: 'public' },
          { name: 'professor', type: 'Professor', visibility: 'public' },
          { name: 'location', type: 'String', visibility: 'public' },
          { name: 'times', type: 'List<Time>', visibility: 'public' },
          { name: 'prerequisites', type: 'List<Course>', visibility: 'public' },
          { name: 'students', type: 'List<Student>', visibility: 'public' }
        ]
      }
    ];

    myDiagram.model = $(go.GraphLinksModel,
      {
        nodeDataArray: nodedata,
      });
  }

}