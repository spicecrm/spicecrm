/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
