import { Injectable } from '@angular/core';
import { NodeData } from '../interfaces/NodeData';

@Injectable()
export class ItemsService {

  private ItemsPaleta: NodeData[];

  constructor() {
    this.createItemsPaleta();
  }

  private createItemsPaleta() {
    this.ItemsPaleta = [
      {
        key: 1,
        name: 'Actor', color: 'lightblue',
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
        name: 'Abstract Class', color : 'lightgreen',
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
        name: 'Class', color: 'white',
        properties: [
          { name: 'classes', type: 'List<Course>', visibility: 'public' },
          { name: 'name', type: 'String', visibility: 'public' },
          { name: 'description', type: 'String', visibility: 'public' }
        ],
        methods: [
          { name: 'attend', parameters: [{ name: 'class', type: 'Course' }], visibility: 'private' },
          { name: 'sleep', visibility: 'private' }
        ]
      },
      {
        key: 14,
        name: '<< Interface >>', color: 'pink',
        properties: [
        ],
        methods: [
          { name: 'deposit', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' },
          { name: 'withdraw', parameters: [{ name: 'amount', type: 'Currency' }], visibility: 'public' }
        ]
      }
    ];
  }

  getItemsPaleta () {
    return this.ItemsPaleta;
  }

}
