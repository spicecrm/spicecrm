/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, OnInit, Injector, SkipSelf, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketnewmodal.html'
})
export class ServiceTicketNewModal implements OnInit{

    /**
     * inpuit for the servicelocations to rpesent to the user
     */
    @Input() public servicelocations: any[] = [];

    /**
     * reference to self to close the modal
     */
    private self: any;

    /**
     * needs to be passed in by the button and cannot be determined by skipself since we are in the hierarchy of calls already
     */
    public parentmodel: any;

    /**
     * the current servicelocation
     */
    private servicelocation_id: string;

    /**
     * the current serviceequipment
     */
    private serviceequipment_id: string;

    constructor(public language: language, public metadata: metadata, public backend: backend, public model: model, public relatedmodels: relatedmodels) {

    }

    /**
     * sort the locations
     */
    public ngOnInit(): void {
        this.servicelocations.sort((a, b) => a.name.localeCompare(b.name) < 1 ? -1 : 1);
    }

    /**
     * getter for the service location
     */
    get servicelocation() {
        return this.servicelocation_id;
    }

    /**
     * setter for the location also resets the equipment id
     * @param servicelocation_id
     */
    set servicelocation(servicelocation_id) {
        this.servicelocation_id = servicelocation_id;
        this.serviceequipment_id = null;
    }

    /**
     * getter for the equipments related to the selected object
     */
    get serviceequipments() {
        return this.servicelocation_id ? this.servicelocations.find(sl => sl.id == this.servicelocation_id).serviceequipments.sort((a, b) => a.name.localeCompare(b.name) < 1 ? -1 : 1) : [];
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }


    /**
     * creates the service ticket
     */
    public createServiceTicket() {
        // determine presets if we found a location and equipment
        let presets: any = {};

        if (this.servicelocation_id) {
            presets.servicelocation_id = this.servicelocation_id;
            presets.servicelocation_name = this.servicelocations.find(sl => sl.id == this.servicelocation_id).name;
            if (this.serviceequipment_id) {
                presets.serviceequipment_id = this.serviceequipment_id;
                presets.serviceequipment_name = this.servicelocations.find(sl => sl.id == this.servicelocation_id).serviceequipments.find(se => se.id == this.serviceequipment_id).name;
            }
        }

        // add the model
        this.model.addModel("", this.parentmodel, presets).subscribe(response => {
            if (response != false) {
                this.relatedmodels.addItems([response]);
            }
        });

        // close the window
        this.close();

    }

}
