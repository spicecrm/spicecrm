/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RecordComponentConfigI} from "../interfaces/spicemap.interfaces";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

/**
 * display a google direction modal
 */
@Component({
    selector: 'spice-google-maps-direction-modal',
    templateUrl: '../templates/spicegooglemapsdirectionmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpiceGoogleMapsDirectionModal implements OnInit {
    /**
     * property to use the component instance destroy
     */
    public self: any = {};
    /**
     * component config from metadata
     */
    public componentconfig: RecordComponentConfigI;
    /**
     * to be passed to the child to activate the direction mode only
     */
    public useMapOptions = {
        direction: true,
        search: false
    };

    constructor(public cdRef: ChangeDetectorRef, public metadata: metadata, public model: model) {
    }

    /**
     * load component configs
     */
    public ngOnInit(): void {
        this.loadComponentConfigs();
    }

    /**
     * load the component config from metadata to save the default map options
     * set the component config locally if it is not set from the outside
     * define the latitude and longitude field names from the module defs
     * copy the component configs to the map options set the geo fields names
     */
    public loadComponentConfigs() {
        // if not defined from the component set get it from module config
        if (!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig('SpiceGoogleMapsDirectionModal', this.model.module);
        }

        if (!this.componentconfig) this.componentconfig = {};

        if (!this.componentconfig.directionTravelMode || ['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'].indexOf(this.componentconfig.directionTravelMode) == -1) {
            this.componentconfig.directionTravelMode = 'DRIVING';
        }
        if (!(!!this.componentconfig.focusColor)) {
            this.componentconfig.focusColor = '#1A73E8';
        }
    }

    public close() {
        this.cdRef.detach();
        this.self.destroy();
    }
}
