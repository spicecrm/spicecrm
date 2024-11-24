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
import {TravelManager} from "./components/travelmanager";
import {DirectivesModule} from "../../directives/directives";
import {TravelManagerButtonGroup} from "./components/travelmanagerbuttongroup";
import {TravelManagerTravelItems} from "./components/travelmanagertravelitems";
import {TravelAddTravelModal} from "./components/traveladdtravelmodal";
import {ModuleSpiceAttachments} from "../../include/spiceattachments/spiceattachments";
import {TravelAddManualTravelReceiptModal} from "./components/traveladdmanualtravelreceiptmodal";
import {TravelAddTravelMileageModal} from "./components/traveladdtravelmileagemodal";
import {TravelAddTravelSegmentModal} from "./components/traveladdtravelsegmentmodal";
import {fieldTravelAllowanceDeductions} from "./fields/fieldtravelallowancedeductions";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleSpiceAttachments,
    ],
    declarations: [
        TravelAddReceiptButton,
        TravelAddReceiptModal,
        TravelReceiptItems,
        TravelReceiptTax,
        TravelManager,
        TravelManagerButtonGroup,
        TravelManagerTravelItems,
        TravelAddTravelModal,
        TravelAddManualTravelReceiptModal,
        TravelAddTravelMileageModal,
        TravelAddTravelSegmentModal,
        fieldTravelAllowanceDeductions
    ]
})
export class ModuleTravels {}
