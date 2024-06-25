/**
 * @module ModuleTravels
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {TravelAddReceiptButton} from "./components/traveladdreceiptbutton";
import {TravelAddReceiptModal} from "./components/traveladdreceiptmodal";
import {TravelReceiptItems} from "./components/travelreceiptitems";
import {TravelReceiptTax} from "./components/travelreceipttax";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        TravelAddReceiptButton,
        TravelAddReceiptModal,
        TravelReceiptItems,
        TravelReceiptTax
    ]
})
export class ModuleTravels {}
