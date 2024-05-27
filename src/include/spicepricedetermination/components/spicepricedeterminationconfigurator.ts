/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modal} from "../../../services/modal.service";
import {SpicePriceDeterminationConfiguratorService} from "../services/spicepricedeterminationconfigurator.service";

declare var moment: any;

/**
 * a modalto set prices on a module
 */
@Component({
    selector: 'spice-price-determination-configurator',
    templateUrl: '../templates/spicepricedeterminationconfigurator.html',
    providers: [SpicePriceDeterminationConfiguratorService]
})
export class SpicePriceDeterminationConfigurator {

    public activeTab: 'schemes'|'types'|'determinations'|'elements' = "schemes";

    public tabs = [
        {
            label: 'LBL_PRICING_SCHEMAS',
            id: 'schemes'
        },
        {
            label: 'LBL_PRICING_CONDITIONTYPES',
            id: 'types'
        },
        {
            label: 'LBL_PRICING_DETERMINATIONS',
            id: 'determinations'
        },
        {
            label: 'LBL_PRICING_ELEMENTS',
            id: 'elements'
        },
    ]

    constructor(public backend: backend, public modal: modal, public cs: SpicePriceDeterminationConfiguratorService) {
        cs.initialize();
    }

    public hasChanges(){
        return true;
    }

    public save(){
        return true;
    }

}
