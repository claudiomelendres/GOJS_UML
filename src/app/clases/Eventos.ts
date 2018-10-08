

export class Eventos {

    error: Boolean;
    typeLink: string;
    errorMensaje: string;
    doted: string;

    constructor() {}

    miInfoLink = function InfoLink(fromnode, fromport, tonode, toport) {
        this.error = false;
        if (tonode.Yd.color === 'pink' && (this.typeLink === 'use' || this.typeLink === 'aggregation')) {
          this.errorMensaje = ' No es posible usar enlaces de: -' + this.typeLink + '- con interfaces ';
          this.error = true;
          return false;
        }

        if (tonode.Yd.color === 'pink') {
          this.doted = true;
        } else {
          this.doted = false;
        }
        return true;
      };
}
