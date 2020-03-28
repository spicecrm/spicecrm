/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {navigation} from "../../../services/navigation.service";

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
            modelId: this.model.id
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
}
