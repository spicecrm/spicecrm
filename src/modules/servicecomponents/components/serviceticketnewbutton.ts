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

@Component({
    templateUrl: '../templates/serviceticketnewbutton.html',
    providers: [model]
})
export class ServiceTicketNewButton {

    /**
     * set to true to disanble the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    /**
     * if set to true display the button as icon
     */
    public displayasicon: boolean = false;

    constructor(public injector: Injector, public language: language, public metadata: metadata, public backend: backend, public modal: modal, public model: model, public relatedmodels: relatedmodels, @SkipSelf() public parentmodel: model) {

    }

    public execute() {
        // initialize the model
        this.model.module = 'ServiceTickets';
        this.model.id = undefined;
        this.model.initialize();

        // render a loading popover
        let awaitmodal = this.modal.await('loading');

        // request data and then create the ticket
        this.backend.getRequest(`module/ServiceTickets/discoverparent/${this.parentmodel.module}/${this.parentmodel.id}`).subscribe(
            res => {
                if (!res.servicelocations) {
                    this.model.addModel("", this.parentmodel).subscribe(response => {
                        if (response != false) {
                            this.relatedmodels.addItems([response]);
                        }
                    });
                } else if (res.servicelocations.length == 0 || (res.servicelocations.length == 1 && (res.servicelocations[0].serviceequipments.length <= 1))) {
                    // determine presets if we found a location and equipment
                    let presets: any = {};
                    if (res.servicelocations && res.servicelocations.length == 1) {
                        presets.servicelocation_id = res.servicelocations[0].id;
                        presets.servicelocation_name = res.servicelocations[0].name;
                        if (res.servicelocations[0].serviceequipments.length == 1) {
                            presets.serviceequipment_id = res.servicelocations[0].serviceequipments[0].id;
                            presets.serviceequipment_name = res.servicelocations[0].serviceequipments[0].name;
                        }
                    }

                    this.model.addModel("", this.parentmodel, presets).subscribe(response => {
                        if (response != false) {
                            this.relatedmodels.addItems([response]);
                        }
                    });
                } else {
                    this.modal.openModal('ServiceTicketNewModal', true, this.injector).subscribe(modalref => {
                        modalref.instance.servicelocations = res.servicelocations;
                        modalref.instance.parentmodel = this.parentmodel;
                    });
                }
                awaitmodal.emit(true);
            },
            err => {
                awaitmodal.emit(true);
            });
    }

    public ngOnInit() {
        if (this.metadata.checkModuleAcl('ServiceTickets', "create")) {
            this.disabled = false;
        }
    }
}
