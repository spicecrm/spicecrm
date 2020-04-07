/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';

/**
 * display a google direction modal
 */
@Component({
    selector: 'spice-google-maps-direction-modal',
    templateUrl: './src/include/spicemap/templates/spicegooglemapsdirectionmodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SpiceGoogleMapsDirectionModal {
    /**
     * property to use the component instance destroy
     */
    public self: any = {};
    /**
     * to be passed to the child to activate the direction mode only
     */
    private useMapOptions = {
        direction: true,
        search: false
    };

    constructor(private cdRef: ChangeDetectorRef) {
    }

    private close() {
        this.cdRef.detach();
        this.self.destroy();
    }
}
