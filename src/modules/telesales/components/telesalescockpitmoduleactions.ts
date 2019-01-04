import {Component, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_module_actions',
    templateUrl: './src/modules/telesales/templates/telesalescockpitmoduleactions.html',
})
export class TeleSalesCockpitModuleActions {

    @ViewChild('moduleactionscontainer', {read: ViewContainerRef}) moduleactionscontainer: ViewContainerRef;

    actionset: any = [];

    constructor(
        private language: language,
        private model: model,
        private telecockpitservice: telecockpitservice,
        private metadata: metadata,
    ) {
        this.telecockpitservice.selectedItem$.subscribe(data => this.loadActionset(data));

    }

    loadActionset(modeldata){
        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitModuleActions', modeldata.module);
        this.actionset = componentconfig.actionset;
    }
}
