/**
 * @module ModuleTravels
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'travel-receipt-items',
    templateUrl: '../templates/travelreceiptitems.html'
})
export class TravelReceiptItems {

    constructor(
        public model: model) {
    }

    get lineItems(){
        return this.model.getField('lineitems') ?? [];
    }

}

