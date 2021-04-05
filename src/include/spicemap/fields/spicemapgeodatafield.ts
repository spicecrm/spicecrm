/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {navigation} from "../../../services/navigation.service";
import {modal} from "../../../services/modal.service";

/**
 * check for the element geo data and display an icon button which emits the click by broadcast service
 * to be received by the map
 */
@Component({
    selector: 'spice-map-geo-data-field',
    templateUrl: './src/include/spicemap/templates/spicemapgeodatafield.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpiceMapGeoDataField implements OnInit {
    /**
     * to activate/deactivate the action emitter
     */
    private hasGeoData: boolean = false;

    constructor(
        private model: model,
        private metadata: metadata,
        private navigation: navigation,
        private broadcast: broadcast,
        private modal: modal,
        private injector: Injector,
        private cdRef: ChangeDetectorRef
    ) {
    }

    /**
     * call to check model geo data
     */
    public ngOnInit() {
        this.checkModelGeoData();
    }

    /**
     * set has geo data to true
     */
    protected setHasGeoData() {
        this.hasGeoData = true;
        this.cdRef.detectChanges();
    }

    /**
     * emit broadcast message map.focus to be received by the map
     */
    private emitBroadcastMessage() {
        const data = {
            tabId: this.navigation.activeTabObject.id,
            record: this.model.data
        };
        this.broadcast.broadcastMessage('map.focus', data);
    }

    /**
     * get the geo data fields names from module defs and check model geo data from
     */
    private checkModelGeoData() {
        const moduleDefs = this.metadata.getModuleDefs(this.model.module);
        if (!!moduleDefs && !!moduleDefs.ftsgeo) {
            const longitudeField = this.model.getField(moduleDefs.ftsgeo.longitude_field);
            const latitudeField = this.model.getField(moduleDefs.ftsgeo.latitude_field);
            if (!!longitudeField && !isNaN(longitudeField) && !!latitudeField && !isNaN(latitudeField)) {
                this.setHasGeoData();
            } else {
                this.cdRef.detach();
            }
        }
    }

    /**
     * open direction modal
     */
    private openDirectionModal() {
        this.modal.openModal('SpiceGoogleMapsDirectionModal', true, this.injector);
    }
}
