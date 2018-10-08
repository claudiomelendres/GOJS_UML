import * as go from 'gojs';

export class Diagrama {

    private $: any;
    private _propertyTemplate: any;
    private _methodTemplate: any;
    private _nodeTemplate: any;
    private _linkTemplate: any;

    get PropertyTemplate(): any {
        return this._propertyTemplate;
    }

    get MethodTemplate(): any {
        return this._methodTemplate;
    }

    get NodeTemplate(): any {
        return this._nodeTemplate;
    }

    get LinkTemplate(): any {
        return this._linkTemplate;
    }

    constructor(maker: any) {
        this.$ = maker;
        this.InitPropertyTemplate();
        this.InitMethodTemplate();
        this.InitNodeTemplate();
        this.InitLinkTemplate();
    }

    private convertVisibility(v) {
        switch (v) {
          case 'public': return '+';
          case 'private': return '-';
          case 'protected': return '#';
          case 'package': return '~';
          default: return v;
        }
      }

    private InitPropertyTemplate() {
        const $ = this.$;
        this._propertyTemplate =
          $(go.Panel, 'Horizontal',
            $(go.TextBlock,
              { isMultiline: false, editable: false, width: 12 },
              new go.Binding('text', 'visibility', this.convertVisibility)),

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
        }

    private InitMethodTemplate() {
        const $ = this.$;
        this._methodTemplate =
        $(go.Panel, 'Horizontal',
        $(go.TextBlock,
          { isMultiline: false, editable: false, width: 12 },
          new go.Binding('text', 'visibility', this.convertVisibility)),
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
    }

    private InitNodeTemplate() {
        const $ = this.$;
        this._nodeTemplate =
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
              itemTemplate: this._propertyTemplate
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
              itemTemplate: this._methodTemplate
            }
          ),
          $('PanelExpanderButton', 'METHODS',
            { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
            new go.Binding('visible', 'methods', function(arr) { return arr.length > 0; }))
        )
      );
    }

    private InitLinkTemplate() {
        const $ = this.$;
        this._linkTemplate =
        $(go.Link,
            { routing: go.Link.None },
            new go.Binding('isLayoutPositioned', 'relationship', this.convertIsTreeLink),
            $(go.Shape,
              new go.Binding('stroke', 'color'),
              new go.Binding('strokeDashArray', 'dash')
              ),
            $(go.Shape, { scale: 1.3, fill: 'red' },
              new go.Binding('fromArrow', 'relationship', this.convertFromArrow)),
            $(go.Shape, { scale: 1.3, fill: 'white' },
              new go.Binding('toArrow', 'relationship', this.convertToArrow))
          );
    }

    convertIsTreeLink(r) {
        return r === 'generalization';
      }
    convertFromArrow(r) {
        switch (r) {
          case 'generalization': return '';
          default: return '';
        }
      }
    convertToArrow(r) {
        switch (r) {
          case 'generalization': return 'Triangle';
          case 'aggregation': return 'StretchedDiamond';
          case 'use': return 'OpenTriangle';
          default: return '';
        }
      }
}
