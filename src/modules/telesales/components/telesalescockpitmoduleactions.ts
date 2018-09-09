import {Component, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

import {telecockpitservice} from '../services/telecockpit.service';

@Component({
    selector: 'tele_sales_cockpit_module_actions',
    templateUrl: './app/modules/telesales/templates/telesalescockpitmoduleactions.html',
})
export class TeleSalesCockpitModuleActions {

    @ViewChild('moduleactionscontainer', {read: ViewContainerRef}) moduleactionscontainer: ViewContainerRef;

    componentconfig: any = {};
    actionsets: any = [];
    actionitems: any = [];
    renderedActionset: Array<any> = [];

    constructor(
        private language: language,
        private model: model,
        private telecockpitservice: telecockpitservice,
        private metadata: metadata,
    ) {
        this.telecockpitservice.selectedItem$.subscribe(data => this.renderView(data));

    }

       resetView(){
        for (let renderedAction of this.renderedActionset){
            renderedAction.destroy();
        }
        this.actionitems = [];

    }

    renderView(modeldata){

        this.resetView();

        let componentconfig = this.metadata.getComponentConfig('TeleSalesCockpitModuleActions', modeldata.module);
        if(componentconfig && componentconfig.actionset) {
            this.actionitems = this.metadata.getActionSetItems(componentconfig.actionset);
            for (let actionitem of this.actionitems) {
                this.metadata.addComponent(actionitem.component, this.moduleactionscontainer).subscribe(componentref => {
                    componentref.instance.parent = this.model;
                    componentref.instance['actionconfig'] = actionitem.actionconfig;
                    this.renderedActionset.push(componentref);
                });
            }
        }
    }

}


