/**
 * @module ModuleTravels
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';

@Component({
    selector: 'travel-receipt-tax',
    templateUrl: '../templates/travelreceipttax.html'
})
export class TravelReceiptTax {

    constructor(
        public model: model) {
    }

    get lineItems(){
        return this.model.getField('taxdetails') ?? [];
    }

}

