/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, Injector, SkipSelf} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

/**
 * renders a new button as part of the actionset in the serviceticket aallowing to create a serviceorder with some related information from the ticekt
 */
@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceordernewbutton.html',
    providers: [model]
})
export class ServiceOrderNewButton {

    /**
     * set to true to disanble the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    /**
     * if set to true display the button as icon
     */
    public displayasicon: boolean = false;

    constructor(private injector: Injector, public language: language, public metadata: metadata, public backend: backend, public modal: modal, public model: model, public relatedmodels: relatedmodels, @SkipSelf() public parentmodel: model) {

    }

    public execute() {
        // initialize the model
        this.model.module = 'ServiceOrders';
        this.model.id = undefined;
        this.model.initialize();

        // render a loading popover
        let awaitmodal = this.modal.await('loading');

        // request data and then create the ticket
        this.backend.getRequest(`module/ServiceOrders/discoverparent/${this.parentmodel.module}/${this.parentmodel.id}`).subscribe(
            res => {

                // determine presets if we found a location and equipment
                let presets: any = {};
                /*
                if (res.servicelocations && res.servicelocations.length == 1) {
                    presets.servicelocation_id = res.servicelocations[0].id;
                    presets.servicelocation_name = res.servicelocations[0].name;
                    if (res.servicelocations[0].serviceequipments.length == 1) {
                        presets.serviceequipment_id = res.servicelocations[0].serviceequipments[0].id;
                        presets.serviceequipment_name = res.servicelocations[0].serviceequipments[0].name;
                    }
                }
                */

                this.model.addModel("", this.parentmodel, presets).subscribe(response => {
                    if (response != false) {
                        this.relatedmodels.addItems([response]);
                    }
                });

                awaitmodal.emit(true);
            },
            err => {
                awaitmodal.emit(true);
            });
    }

    public ngOnInit() {
        if (this.metadata.checkModuleAcl('ServiceOrders', "create")) {
            this.disabled = false;
        }
    }
}
