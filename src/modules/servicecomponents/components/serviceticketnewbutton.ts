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
import {Component, EventEmitter, Injector, SkipSelf} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/servicecomponents/templates/serviceticketnewbutton.html',
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

    constructor(private injector: Injector, public language: language, public metadata: metadata, public backend: backend, public modal: modal, public model: model, public relatedmodels: relatedmodels, @SkipSelf() public parentmodel: model) {

    }

    public execute() {
        // initialize the model
        this.model.module = 'ServiceTickets';
        this.model.id = undefined;
        this.model.initialize();

        // render a loading popover
        let awaitmodal = this.modal.await('loading');

        // request data and then create the ticket
        this.backend.getRequest(`modules/ServiceTickets/discoverparent/${this.parentmodel.module}/${this.parentmodel.id}`).subscribe(
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
